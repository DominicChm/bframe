import _, {cloneDeep} from "lodash"


export class MutableProxy<T extends Object> implements ProxyHandler<T> {
    public previous: T;
    public patch: Partial<T> = {};
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
        if(this._keyDenyList.has(key))
            throw new Error(`key deny list has >${key}<`);

        //Only set existing fields.
        if(target[key] === undefined)
            throw new Error(`>${key}< is undefined on target object`);

        target[key] = value;
        this.patch[key] = value;
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

