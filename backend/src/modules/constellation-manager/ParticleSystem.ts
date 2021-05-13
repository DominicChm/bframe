import WebSocket, {AddressInfo, Data} from "ws";
import {
    compose_ERROR,
    compose_HANDSHAKE_RESPONSE,
    IParticleHandshake,
    opcode_ctype,
    parse_HANDSHAKE
} from "../protocol";
import {handle_handshake} from "bc/protocol";
import {RuntimeIdProvider} from "./runtime-id-provider/RuntimeIdProvider";
import {ParticleDefinitionRegistry} from "./particle-def-registry/ParticleDefinitionRegistry";
import {logger} from "bc/logging";
import {IParticleSystemOptions, ISystemParticleDefinition} from "./interfaces";
import {ParticleManager} from "./particle-manager/";
import EventEmitter from "events";
import {IParticleSystemDefinition} from "./interfaces";
import {wrapProtocolError} from "../protocol/ws_util/wrapProtocolError";

const log = logger("particle manager")


export class ParticleSystem extends EventEmitter {
    private wss: WebSocket.Server;
    private ridProvider: RuntimeIdProvider = new RuntimeIdProvider();
    private particles: { [key: string]: ParticleManager<any, any> } = {};
    private unassignedParticles: { ws: WebSocket, pInfo: IParticleHandshake }[] = [];
    private systemDefinition: IParticleSystemDefinition;

    private particleDefRegistry: ParticleDefinitionRegistry = new ParticleDefinitionRegistry();

    //Expose registry methods
    public registerDefinition = this.particleDefRegistry.registerDefinition.bind(this.particleDefRegistry);
    public getDefByTypename = this.particleDefRegistry.getDefByTypename.bind(this.particleDefRegistry);

    public readonly port;

    constructor(options: IParticleSystemOptions) {
        super();
        log("Starting websocket server");
        this.wss = new WebSocket.Server({port: options.port});
        this.port = (this.wss.address() as AddressInfo).port;

        //Setup initial listeners
        this.wss.on("connection", (socket) => {
                log("Incoming connection");
                const handler_wrapped = wrapProtocolError((msg) => this.handleHandshake(socket, msg), socket);
                socket.on("message", handler_wrapped);
            }
        );
    }

    /**
     * Loads a ParticleSystem definition. Keeps current connections and ParticleManagers alive if possible.
     */
    public loadSystem(sys: IParticleSystemDefinition) {
        console.log("Loading new system");
        this.systemDefinition = sys;

        const newParticles = {};

        //Instance new particles.
        for (const par of sys.particles) {
            const typeDef = this.particleDefRegistry.getDefByTypename(par.typeName);

            if (!typeDef) {
                log(`Particle with UID >${par.uid}< was not loaded because typeName >${par.typeName}< wasn't found.`, "error");
                continue;
            }

            //If PM already exists for UID, reassign existing manager to new system.
            if (this.particles[par.uid]) {
                newParticles[par.uid] = this.particles[par.uid].loadSystemDef(par);

                //Delete reassigned PM from current particles, which are orphaned after load.
                delete this.particles[par.uid];
            } else {
                newParticles[par.uid] = new ParticleManager(typeDef).loadSystemDef(par);
            }
        }

        //Move info of any newly orphaned particles to unassigned arr.
        for (let particlesKey in this.particles) {
            const unassignedInfo = this.particles[particlesKey].disconnectWs();
            this.unassignedParticles.push(unassignedInfo);
        }

        this.particles = newParticles; //Assign newly loaded system.
    }

    /**
     * Bound to every connecting websocket to receive and handle the first handshake packet. Once particle type and
     * UID is known, it's handed off to the appropriate ParticleManager. Should be wrapped by wrapProtocolError() to
     * automatically send errors to the connecting websocket.
     */
    private handleHandshake(ws: WebSocket, msg: Data): void {
        if (!(msg instanceof Buffer)) throw new Error("msg is not an instance of Buffer!");
        const pInfo = parse_HANDSHAKE(msg);
        const def = this.particleDefRegistry.getDefByTypename(pInfo.typeName);

        if (!def) throw new Error(`Handshake error: No definition exists for >${pInfo.typeName}<`);

        if (this.particles[pInfo.uid]) {
            const rid = this.ridProvider.allocRid(pInfo.uid);

            this.particles[pInfo.uid].connectWs(ws, pInfo, rid);

        } else { //This UID is not in the system, add the particle to a list of unassigned particles
            this.unassignedParticles.push({ws, pInfo});
            log(`Unassigned particle connected! (uid=${pInfo.uid})`);
        }
    }

    /**
     * Stops the ParticleManager so it doesn't hang the node process.
     */
    stop() {
        this.wss.close()
    }

    particle(uid: string) {

    }

    //Fires on any state update
    on(event: "patch", listener: (patch: Object) => void);
    on(event, listener) {

    }
}
