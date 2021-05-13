import EventEmitter from "events";
import WebSocket from "ws";
import {
    compose_HANDSHAKE_RESPONSE,
    EClientOp,
    IParticleHandshake,
    opcode_ctype,
    parse_STATE_UPDATE,
    var_id_ctype
} from "bc/protocol";

import {IParticleTypeDefinition, ISystemParticleDefinition} from "../interfaces";
import _ from "lodash";
import {verifyInitialServerState} from "./verifyInitialServerState";

export declare interface ParticleManager<TParticleState, TServerState> {
    /**
     * Emitted when a particle actually connects to this manager.
     */
    on(event: "connection", listener: (pm: ParticleManager<TParticleState, TServerState>) => void)

    /**
     * Comprehensive particle state change listener.
     */
    on(event: "particleState", listener: (
        current: TParticleState,
        patch: Partial<TParticleState>,
        last: TParticleState | undefined) => void
    )

    /**
     * Comprehensive server state change listener.
     */
    on(event: "serverState", listener: (
        current: TServerState,
        patch: Partial<TServerState>,
        last: TServerState) => void
    )

}

export class ParticleManager<TParticleState, TServerState> extends EventEmitter {
    private ws: WebSocket;
    private readonly _typeDefinition: IParticleTypeDefinition<TParticleState, TServerState>;
    private _systemDefinition: ISystemParticleDefinition<TServerState> | undefined;
    private pInfo: IParticleHandshake;

    //Publicly accessible "meta" state.
    public uid: string | undefined;
    public connected: boolean = false;
    public readonly typeName: string;


    private _particleState: TParticleState;
    private _serverState: TServerState;

    //The last state the particle sent to us.
    private _lastParticleState: TParticleState | undefined;
    private _particleStatePatch: Partial<TParticleState> = {};

    //The last state the particle was sent.
    private _lastParticleServerState: TServerState | undefined;
    private _serverStatePatch: Partial<TServerState> = {};

    private readonly op_handler_map: { [Key in EClientOp]: (msg: WebSocket.Data) => void } = {
        [EClientOp.ERROR]: this.handleDUMMY,
        [EClientOp.HANDSHAKE]: this.handleDUMMY,
        [EClientOp.STATE_UPDATE]: this.receiveParticleState,
    }

    constructor(
        typeDefinition: IParticleTypeDefinition<TParticleState, TServerState>,
    ) {
        super();
        this._typeDefinition = typeDefinition;

        //Initialize own state.
        this.typeName = typeDefinition.typeName;
    }

    /**
     * Accepts a new websocket connection that has just sent a handshake packet and has had its UID matched
     * with this manager instance.
     */
    connectWs(ws: WebSocket, particleInfo: IParticleHandshake, rid: number) {
        if (!this._systemDefinition)
            throw new Error("WS Connection attempted without loaded systemDefinition!");
        if (this.ws) this.ws.close();
        this.ws = ws;
        this.pInfo = particleInfo;

        ws.on("message", this.distributeMessage.bind(this));

        this.connected = true;

        this.emit("connection", this);

        //Handle the handshake response at the end of initialization.
        ws.send(compose_HANDSHAKE_RESPONSE(rid));

        //Send a state update that contains the entire state.
        this._serverStatePatch = this._serverState
        this.sendServerState();
    }

    disconnectWs(): { ws: WebSocket, pInfo: IParticleHandshake } {
        this.ws.removeAllListeners();
        return {ws: this.ws, pInfo: this.pInfo}
    }

    /**
     * Loads a system definition. Does any needed particle definition.
     */
    loadSystemDef(systemParticleDefinition: ISystemParticleDefinition<TServerState>): this {
        //Once a PM has been initialized, it only handles a particle with a certain UID.
        if (this.uid && systemParticleDefinition.uid !== this.uid)
            throw new Error(`Attempt to load system def with different UID than ${this.uid}`)

        verifyInitialServerState(this._typeDefinition, systemParticleDefinition);

        this._systemDefinition = systemParticleDefinition;
        this.uid = systemParticleDefinition.uid;
        this._serverState = systemParticleDefinition.initialServerState;

        //Send a state update that contains the entire state.
        this._serverStatePatch = this._serverState
        this.sendServerState();

        return this;
    }

    /**
     * Updates the state of the particle and fires data events.
     */
    private receiveParticleState(data: Buffer) {
        const stateUpdate = parse_STATE_UPDATE(data);
        for (let i = 0; i < stateUpdate.data.length; i) {
            //Read variable ID
            const varId: number = var_id_ctype.readLE(stateUpdate.data, i);
            i += var_id_ctype.size;

            //Find variable def by looking it up with ID as index.
            const varDef = this._typeDefinition.particleVariables[varId];

            //Parse and apply the new data to the temporary patch object.
            //TODO: Fix this typing?
            this._particleStatePatch[varDef.symbol] = varDef.c_type.readLE(data, i) as any;
        }

        //Parch particle state with new state.
        _.merge(this._particleState, [this._particleStatePatch]);

        //Emit state event
        this.emit("particleState", [
            this._particleState,
            this._particleStatePatch,
            this._lastParticleState
        ])

        //Reset state vars for new frame
        this._particleStatePatch = {};
        this._lastParticleState = _.cloneDeep(this._particleState);

    }

    /**
     * Sends the current patch to the connected particle, if connected.
     */
    private sendServerState() {
        throw new Error("UNIMPLEMENTED")
    }

    private distributeMessage(msg: WebSocket.Data) {
        if (msg instanceof Buffer) {
            // Decode opcode, pass data to correct handler.
            const op = opcode_ctype.readLE(msg)

            //Pass through to handler function.
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


    /**
     *  Mutates server state.
     */
    public put<K extends keyof TServerState>(key: K, value: TServerState[K]): void {
        this._serverState[key] = value;
        this._serverStatePatch[key] = value;
    }

    /**
     *  gets particle or server state.
     */
    public get<K extends keyof TParticleState>(key: K): TParticleState[K];
    public get<K extends keyof TServerState>(key: K): TServerState[K];
    public get(key: string): any {
        //return _.cloneDeep(this._clientState[key]);
    }


}
