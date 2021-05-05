import EventEmitter from "events";
import WebSocket from "ws";
import {ParticleDefinitionRegistry} from "../particle-def-registry/ParticleDefinitionRegistry";
import {EClientOp, opcode_ctype, parse_HANDSHAKE} from "bc/protocol";

export declare interface ParticleConnectionManager<ParticleState_t> {
    on()
}

export class ParticleConnectionManager<ParticleState_t> extends EventEmitter {
    private readonly ws: WebSocket;
    private readonly registry: ParticleDefinitionRegistry;
    uid: string = "";

    private readonly op_handler_map: { [Key in EClientOp]: (msg: WebSocket.Data) => void } = {
        [EClientOp.ERROR]: this.handleDUMMY,
        [EClientOp.HANDSHAKE]: this.handleHandshake,
        [EClientOp.STATE_UPDATE]: this.handleDUMMY,
    }

    constructor(ws: WebSocket, registry: ParticleDefinitionRegistry) {
        super();
        this.registry = registry;
        ws.on("message", this.distributeMessage.bind(this));
    }

    private distributeMessage(msg: WebSocket.Data) {
        if (msg instanceof Buffer) {
            // Decode opcode, pass data to correct handler.
            const op = opcode_ctype.readLE(msg)
            this.op_handler_map[op](msg);

        } else {
            throw new Error(`Received message ${msg} is not a buffer!`)
        }
    }

    handleDUMMY(msg: WebSocket.Data) {
    }


    handleHandshake(msg: Buffer) {
        const particle_info = parse_HANDSHAKE(msg);
        this.uid = particle_info.uid;

        const def = this.registry.getDefByTypename(particle_info.type);
    }

}
