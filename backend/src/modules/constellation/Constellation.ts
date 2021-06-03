import EventEmitter from "events";
import {IConstellationDefinition, IParticleTypeDefinition} from "./interfaces";
import {Particle} from "./particle/Particle";
import {ParticleInstancer} from "./particle/ParticleInstancer";
import {cStruct, end, uint16, uint8} from "c-type-util";
import {RIDRegistry} from "./runtime-id-registry/RIDRegistry";
import {Connector, ResponseFn, Router} from "./router/Router";
import {WebsocketConnector} from "./router/connector/WebsocketConnector";
import {IdHeaderCT} from "../protocol";
import {EClientOp, ParticleHandshakeCT, serializeError, serializeHandshakeResponse} from "../protocol";
import {logger} from "bc/logging";

const log = logger("Constellation");

export interface ConstellationConfig {
    portUdpParticle: number,
    portUdpServer: number,
    portWsServer: number,
}


const opCodeType = uint8;
const ridType = uint16;

export class Constellation extends EventEmitter {
    private _particles = [];
    private _unassignedParticles = [];
    private _tDefs: IParticleTypeDefinition<any>[] = [];
    private _router: Router;
    private _wsConnector: WebsocketConnector;
    private _particleFactory: ParticleInstancer;
    private _ridRegistry: RIDRegistry;
    private readonly _manualConnectors: Connector[]; //Used to plug connectors directly into Constellation for testing.
    private _config: ConstellationConfig;

    constructor(config: Partial<ConstellationConfig>, connectors: Connector[] = []) {
        super();
        this._manualConnectors = connectors;
        this._config = {
            portUdpParticle: 6901,
            portUdpServer: 6901,
            portWsServer: 6900,
            ...config
        };
    }

    async load(def: IConstellationDefinition) {
        //setup endpoints and routing
        this._router = new Router();

        //Setup connectors TODO: REFACTOR THIS?
        if (this._manualConnectors.length > 0) {
            this._manualConnectors.forEach(c => this._router.addConnector(c)); //Register test connectors
        } else { //Setup default connectors
            this._wsConnector = new WebsocketConnector({port: this._config.portWsServer});
            this._router.addConnector(this._wsConnector);
        }

        //Setup router handlers
        this._router.handleUnrouted(this._handleUnrouted.bind(this))
        this._router.route(this._route.bind(this));

        //Setup particles
        this._ridRegistry = new RIDRegistry();
        this._particleFactory = new ParticleInstancer(this._tDefs, this._ridRegistry);

        this._particles = def.particles.map(pDef => this._particleFactory.construct(pDef));
        for (const particle of this._particles) {
            this._router.addEndpoint(particle.uid, particle);

        }
    }

    private _route(data: Buffer): string | undefined {
        const routableOps = new Set([EClientOp.ERROR, EClientOp.STATE_UPDATE]);
        const op = opCodeType.readLE(data);
        if (routableOps.has(op)) {
            const {rid} = IdHeaderCT.readLE(data);
            const uid = this._ridRegistry.resolveUidFromRid(rid);
            return uid
        }

        //If not routable, return undefined - msg will be handled later.
        return undefined;
    }

    private async _handleUnrouted(data: Buffer, respond: ResponseFn) {
        const op = opCodeType.readLE(data);

        switch (op) {
            case EClientOp.HANDSHAKE:
                await this._performHandshake(data, respond);
                log("Handshake received");
                break;
            default:
                log("Unhandled, unroutable message received!", "warn");
                console.log(data);
        }
    }

    private async _performHandshake(data: Buffer, respond: ResponseFn) {
        const {typeName, uid} = ParticleHandshakeCT.readLE(data);

        // Check if typename valid
        const tDef = this.particleTypeDef(typeName);
        if (!tDef) {
            await respond(serializeError(0x00, `No type >${typeName}< found!`))
            log(`Attempted handshake with unknown typename >${typeName}<`, "warn");
            return;
        }

        //If no particle to handle this UID in def, create a new particle.
        const rid = this._ridRegistry.allocRid(uid);

        if (!this.particle(uid)) {
            const p = new Particle()
                .setTDef(tDef)
                .setRid(rid)
                .setUid(uid);

            this._router.addEndpoint(uid, p);
        }

        await respond(serializeHandshakeResponse(rid));
    }

    registerParticleType(tDef: IParticleTypeDefinition<any>) {
        this._tDefs.push(tDef);
    }

    particleTypeDef(typeName: string) {
        return this._tDefs.find(d => d.typeName === typeName);
    }

    particle(uid: string): Particle<any> | undefined {
        //FIXME: REPLACE WITH AN OBJECT LOOKUP.
        return this._particles.find((p) => p.uid === uid);
    }
}
