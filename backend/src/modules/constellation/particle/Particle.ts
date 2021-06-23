import {IParticleTypeDefinition, ISystemParticleDefinition, IVariableDefinition} from "../interfaces";
import {ResponseFn, RouterEndpoint} from "../router/Router";
import _ from "lodash";
import {ParticleDef} from "../particle-def/ParticleDef";
import {EClientOp} from "../../protocol";
import {MutableProxy} from "./mutableProxy";
import EventEmitter from "events";
import {ParticleEventEmitter} from "./ParticleEventEmitter";
import {logger} from "bc/logging";

const log = logger("Particle");

export type PatchFn<S> = (state: S) => void;

export class Particle<S extends Object> extends EventEmitter implements RouterEndpoint, ParticleEventEmitter<S> {
    public uid: string;
    public rid: number;
    public endian: "little" | "big";
    public assigned: boolean = false;

    private _respond: ResponseFn;
    private _def: ParticleDef<S>;
    private _pDef: ISystemParticleDefinition<S>;
    private _tDef: IParticleTypeDefinition<S>;
    private _blockedStateKeys: Set<string> = new Set();

    // Data-State. All state variables of particle.
    private _dState: S;

    //Builders
    setTDef(tDef: IParticleTypeDefinition<S>): this {
        this._tDef = tDef;
        this.endian = this._tDef.endian;
        this._dState ||= _.cloneDeep(tDef.defaultInitialState);
        this._def = new ParticleDef<S>(tDef);

        for (const [k, v] of Object.entries<IVariableDefinition<any>>(tDef.variables)) {
            if (v.owner === "particle") //Disallow setting keys that belong to particles.
                this._blockedStateKeys.add(k);
        }

        return this;
    }

    setPDef(pDef: ISystemParticleDefinition<S>): this {
        this._pDef = pDef;
        this._dState = _.cloneDeep(pDef.initialState);
        this.uid = this._pDef.uid;
        this.assigned = true;
        return this;
    }

    setRid(rid: number): this {
        this.rid = rid;
        return this;
    }

    setUid(uid: string): this {
        this.uid = uid;
        return this;
    }

    //Router endpoint implementation
    push(data: Buffer, respond: ResponseFn): void {
        this._respond = respond;

        const op = this._def.parseOp(data);
        switch (op) {
            case EClientOp.HANDSHAKE:
                this._receiveHandshake(data, respond);
                break
            case EClientOp.STATE_UPDATE:
                this._receiveStateUpdate(data);
        }
    }

    private async _receiveHandshake(data: Buffer, respond: ResponseFn) {
        console.log(this._dState)
        await this._sendState(this._dState);
    }

    /**
     * Patches a received binary state updated into this object's state, based on the type definition.
     */
    private _receiveStateUpdate(data: Buffer) {
        const {patch} = this._def.parseStateUpdate(data)

        this._patch(p => {
            _.merge(p, patch);
        }, false);
    }

    /**
     * Allows the passed function to directly modify this particle's SERVER state.
     */
    public patch(fn: PatchFn<S>) {
        this._patch(fn);
    }

    /**
     * Allows the passed function to directly modify this particle's state.
     */
    private _patch(fn: PatchFn<S>, restrictKeys = true) {
        // Setup patch by copying current state object and creating new proxy to wrap it
        const proxyHandler = new MutableProxy<S>(restrictKeys ? this._blockedStateKeys : undefined);
        const patchable = new Proxy<S>(_.cloneDeep(this._dState), proxyHandler);

        // Pass the object proxy to the passed patcher function
        fn(patchable);

        //proxyHandler now has last state, current state, and patch. Send this patch to the particle
        this._sendState(proxyHandler.patch);

        // Emit new state
        this.emit("patch", proxyHandler.patch, this);
        this.emit("state", proxyHandler.current, this);
        this.emit("change", proxyHandler.current, proxyHandler.patch, proxyHandler.previous, this);
    }

    private async _sendState(state: Partial<S>) {
        const updatePatch = this._def.composeStateUpdate(state);
        if (this._respond)
            await this._respond(updatePatch);

    }
}
