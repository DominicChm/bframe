import EventEmitter from "events";
import WebSocket from "ws";
import {ParticleDefinitionRegistry} from "../particle-def-registry/ParticleDefinitionRegistry";
import {EClientOp, IParticleHandshake, opcode_ctype, parse_HANDSHAKE} from "bc/protocol";
import {IParticleTypeDefinition} from "../interfaces";

export declare interface ParticleConnectionManager<TParticleState, TServerState> {
    on()
}

export class ParticleConnectionManager<TParticleState, TServerState> extends EventEmitter {
    private ws: WebSocket;
    private readonly registry: ParticleDefinitionRegistry;
    public uid: string = "";
    public connected: boolean = false;

    private readonly op_handler_map: { [Key in EClientOp]: (msg: WebSocket.Data) => void } = {
        [EClientOp.ERROR]: this.handleDUMMY,
        [EClientOp.HANDSHAKE]: this.handleDUMMY,
        [EClientOp.STATE_UPDATE]: this.handleDUMMY,
    }

    constructor(definition: IParticleTypeDefinition<TParticleState, TServerState>) {
        super();
    }

    /**
     * Accepts a new websocket connection that has just sent a handshake packet and has had its UID matched
     * with this manager instance.
     */
    handoffWs(ws: WebSocket, particleInfo: IParticleHandshake) {
        if (this.ws) this.ws.close();

        this.ws = ws;
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

    public terminate() {
        this.ws.close();
    }

}
