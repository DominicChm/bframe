import WebSocket from "ws";
import {compose_HANDSHAKE_RESPONSE, IParticleHandshake} from "../protocol";
import {handle_handshake} from "bc/protocol";
import {RuntimeIdProvider} from "./runtime-id-provider/RuntimeIdProvider";
import {ParticleDefinitionRegistry} from "./particle-def-registry/ParticleDefinitionRegistry";
import {logger} from "bc/logging";

const log = logger("particle manager")

export class ParticleManager {
    private wss: WebSocket.Server;
    private rid_provider: RuntimeIdProvider = new RuntimeIdProvider();
    private pdef_registry: ParticleDefinitionRegistry = new ParticleDefinitionRegistry();

    constructor() {
        log("Starting websocket server");
        this.wss = new WebSocket.Server({port: 369});
        this.wss.on("connection", (socket) => {
                log("Incoming connection")
                handle_handshake(socket, this.handleHandshake)
            }
        );
    }

    handleHandshake(particle_info: IParticleHandshake, ws: WebSocket): Buffer {
        const def = this.pdef_registry.getDefByTypename(particle_info.type);
        if (!def) {
            //TODO: Fail gracefully.
            throw new Error(`No definition exists for typename ${particle_info.type}`);
        }

        const rid = this.rid_provider.allocRid(particle_info.uid);

        return compose_HANDSHAKE_RESPONSE(rid);
    }

}
