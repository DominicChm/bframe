import {Connector, ResponseFn, RouterEndpoint} from "../router/Router";
import {DeferredPromise} from "../../util";

export class TestEndpoint implements RouterEndpoint {
    public data = new DeferredPromise();

    push(data: Buffer, respond: ResponseFn): void {
        this.data.resolve(data);
    }
}

export class TestConnector extends Connector {
    response = new DeferredPromise<Buffer>();

    pushData(data: Buffer) {
        //Delay pushing a tick to allow following awaits to execute.
        setTimeout(() => this.push(data, this.response.resolve), 1);
    }
}
