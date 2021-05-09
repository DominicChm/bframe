import EventEmitter from "events";
import WebSocket from "ws";
import {ParticleDefinitionRegistry} from "../particle-def-registry/ParticleDefinitionRegistry";
import {compose_HANDSHAKE_RESPONSE, EClientOp, IParticleHandshake, opcode_ctype, parse_HANDSHAKE} from "bc/protocol";
import {IParticleTypeDefinition} from "../interfaces";

export declare interface ParticleManager<TParticleState, TServerState> {
    on()
}

export class ParticleManager<TParticleState, TServerState> extends EventEmitter {
    private ws: WebSocket;
    private readonly def: IParticleTypeDefinition<TParticleState, TServerState>;

    public uid: string = "";
    public connected: boolean = false;
    public readonly typeName: string;


    private readonly op_handler_map: { [Key in EClientOp]: (msg: WebSocket.Data) => void } = {
        [EClientOp.ERROR]: this.handleDUMMY,
        [EClientOp.HANDSHAKE]: this.handleDUMMY,
        [EClientOp.STATE_UPDATE]: this.handleDUMMY,
    }

    constructor(systemDefinition, typeDefinition: IParticleTypeDefinition<TParticleState, TServerState>) {
        super();
        this.def = typeDefinition;
    }

    /**
     * Accepts a new websocket connection that has just sent a handshake packet and has had its UID matched
     * with this manager instance.
     */
    handoffWs(ws: WebSocket, particleInfo: IParticleHandshake, rid: number) {
        if (this.ws) this.ws.close();

        this.ws = ws;

        ws.on("message", this.distributeMessage.bind(this));

        //Handle the handshake response at the end of initialization.
        ws.send(compose_HANDSHAKE_RESPONSE(rid));
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
