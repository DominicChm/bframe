import WebSocket, {AddressInfo} from "ws";
import {compose_ERROR, compose_HANDSHAKE_RESPONSE, IParticleHandshake} from "../protocol";
import {handle_handshake} from "bc/protocol";
import {RuntimeIdProvider} from "./runtime-id-provider/RuntimeIdProvider";
import {ParticleDefinitionRegistry} from "./particle-def-registry/ParticleDefinitionRegistry";
import {logger} from "bc/logging";
import {IParticleSystemOptions} from "./interfaces";
import {ParticleManager} from "./particle-manager/";
import EventEmitter from "events";
import {IParticleStatePatchEvent} from "./interfaces/PMEvents/IParticleStatePatchEvent";
import {IParticleSystemDefinition} from "./interfaces";

const log = logger("particle manager")


export class ParticleSystem extends EventEmitter {
    private wss: WebSocket.Server;
    private ridProvider: RuntimeIdProvider = new RuntimeIdProvider();
    private particleConnections: { [key: string]: ParticleManager<any, any> } = {};
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
                log("Incoming connection")
                handle_handshake(socket, this.handleHandshake.bind(this))
            }
        );
    }

    loadSystem(sys: IParticleSystemDefinition) {
        console.log("Loading new system");
        this.particleConnections = {};
        for (const par of sys.particles) {
            const def = this.particleDefRegistry.getDefByTypename(par.typeName);
            if (!def) console.error(`Particle with UID >${par.uid}< was not loaded because typeName >${par.typeName}< wasn't found.`);

            this.particleConnections[par.uid] = new ParticleManager(def);
        }
    }

    handleHandshake(particle_info: IParticleHandshake, ws: WebSocket): Buffer {
        const def = this.particleDefRegistry.getDefByTypename(particle_info.typeName);
        if (!def) {
            throw new Error(`Handshake error: No definition exists for ${particle_info.typeName}`);
        }

        if (this.particleConnections[particle_info.uid]) {
            this.particleConnections[particle_info.uid].terminate();
        }

        const pcm = new ParticleManager(def);
        this.particleConnections[particle_info.uid] = pcm;

        const rid = this.ridProvider.allocRid(particle_info.uid);
        return compose_HANDSHAKE_RESPONSE(rid);
    }

    /**
     * Stops the ParticleManager so it doesn't hang the node process.
     */
    stop() {
        this.wss.close()
    }

    particle(uid: string) {

    }

    on(event: "patch", listener: (patch: Object) => void);
    on(event, listener) {

    }
}
