import {Connector, ResponseFn, RouterEndpoint} from "../router/Router";
import EventEmitter from "events";

export class TestEndpoint extends EventEmitter implements RouterEndpoint {
    push(data: Buffer, respond: ResponseFn): void {
        this.emit("data", data);
    }
}

export class TestConnector extends Connector {
    on(event: "data", listener: (data: Buffer, respond: ResponseFn) => void): this;
    on(event: "response", listener: (data: Buffer) => void): this;
    on(event, listener) {
        return super.on(event, listener);
    }

    pushData(data: Buffer) {
        this.push(data, (buf) => this.emit("response", buf))
    }
}
