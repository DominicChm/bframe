import {IParticleTypeDefinition, ISystemParticleDefinition, IVariableDefinition} from "../interfaces";
import {ResponseFn, RouterEndpoint} from "../router/Router";
import _ from "lodash";
import {ParticleDef} from "../particle-def/ParticleDef";
import {OpCT} from "../../protocol/ctypes/OpCT";
import {EClientOp} from "../../protocol";
import {MutableProxy} from "./mutableProxy";
import EventEmitter from "events";

export type PatchFn<S> = (state: S) => void;

export class Particle<S extends Object> extends EventEmitter implements RouterEndpoint {
    public uid: string;
    public rid: number;
    public endian: "little" | "big";
    public assigned: boolean = false;

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
            if (v.owner === "particle")
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
        const op = this._def.parseOp(data);
        switch (op) {
            case EClientOp.STATE_UPDATE:
                this._receiveStateUpdate(data);
        }
    }

    private _receiveStateUpdate(data: Buffer) {
        const patch = this._def.parseStateUpdate(data)
        this.patch(p => {
            Object.assign(p, patch);
        })
    }

    public patch(fn: PatchFn<S>) {
        const proxyHandler = new MutableProxy(this._blockedStateKeys);
        const patchable = new Proxy<S>(_.cloneDeep(this._dState), proxyHandler);
        fn(patchable);
        this.emit("patch", proxyHandler.patch, this);
        this.emit("state", proxyHandler.current, this);
        this.emit("change", proxyHandler.current, proxyHandler.patch, proxyHandler.previous, this);
    }

    //State-related events
    on(event: "patch", listener: (patch: Partial<S>, particle: Particle<S>) => void): this;
    on(event: "state", listener: (state: S, particle: Particle<S>) => void): this;
    on(event: "change", listener: (current: S, patch: Partial<S>, previous: S, particle: Particle<S>) => void): this;

    on(event: "connect", listener: (particle: Particle<S>) => void): this;
    on(event: "disconnect", listener: (particle: Particle<S>) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        super.on(event, listener);
        return this;
    }

}
