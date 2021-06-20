import _, {cloneDeep} from "lodash"

/**
 * A proxy handler that has additional functionality to track state before and after object mutation through a proxy.
 * It provides the current object state, the original object state, and what has changed in between the two (patch)
 */
export class MutableProxy<T extends Object> implements ProxyHandler<T> {
    /**
     * The original state of the object, before changes were recorded
     */
    public previous: T;

    /**
     * An object containing the fields and values that have changed between the original and current state
     */
    public patch: Partial<T> = {};

    /**
     * The current state of the object
     */
    public current: T;

    private _keyDenyList: Set<string>

    constructor(keyDenyList: Set<string> = new Set()) {
        this._keyDenyList = keyDenyList;
    }

    private _init(target: T) {
        this.previous ||= _.cloneDeep(target);
        this.current ||= target;
    }

    get(target: T, key) {
        this._init(target);
        return target[key];
    }

    set(target: T, key, value) {
        this._init(target);

        //Do not set blocked fields
        if (this._keyDenyList.has(key))
            throw new Error(`key deny list has >${key}<`);

        //Only set existing fields.
        if (target[key] === undefined)
            throw new Error(`>${key}< is undefined on target object`);

        // Only record as patch if the set value is different to the current.
        if (target[key] !== value)
            this.patch[key] = value;

        target[key] = value;

        return true;
    }

    defineProperty(target: T, key, desc) {
        this._init(target);
        return false;
    }

    deleteProperty(target: T, key) {
        this._init(target);
        return false;
    }
}

