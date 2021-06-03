/**
 * A promise that can be externally resolved/rejected. It resets after a resolution/rejection so it can
 * be awaited multiple times.
 */
export class DeferredPromise<T> {
    private _promise: Promise<T>;
    public resolve: (value: T | PromiseLike<T>) => void;
    public reject: (reason?: any) => void;
    public then: Promise<T>["then"];
    public catch: Promise<T>["catch"];
    public finally: Promise<T>["finally"];
    public [Symbol.toStringTag] = "Promise";

    constructor() {
        this._bindPromise();
    }

    private _bindPromise() {
        this._promise = new Promise((resolve, reject) => {
            // assign the resolve and reject functions to `this`
            // making them usable on the class instance
            this.resolve = (value: T | PromiseLike<T>) => {
                resolve(value)
                this._bindPromise()
            };
            this.reject = (reason?: any) => {
                reject(reason)
                this._bindPromise()
            };
        });
        // bind `then` and `catch` to implement the same interface as Promise
        this.then = this._promise.then.bind(this._promise);
        this.catch = this._promise.catch.bind(this._promise);
        this.finally = this._promise.finally.bind(this._promise);
    }

    static Promisify<T>(fn, ...arg): DeferredPromise<T> {
        const p = new DeferredPromise<T>();
        fn(...arg, p.resolve);
        return p;
    }
}
