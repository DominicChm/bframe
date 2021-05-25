import EventEmitter from "events";

export type ResponseFn = (data: Buffer) => Promise<unknown> | unknown;

export class Connector extends EventEmitter {
    on(event: "data", listener: (data: Buffer, respond: ResponseFn) => void): this;
    on(event, listener) {
        return super.on(event, listener);
    }

    protected push(data: Buffer, respond: ResponseFn) {
        this.emit("data", data, respond);
    }
}
