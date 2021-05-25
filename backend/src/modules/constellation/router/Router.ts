import {Connector, ResponseFn} from "./connector/Connector";

export {Connector, ResponseFn}

export interface RouterEndpoint {
    push(data: Buffer, respond: ResponseFn): void;
}

export class Router {
    private _connectors: Connector[] = [];
    private _map: { [key: string]: RouterEndpoint } = {};

    private _unaddressedHandler: (data: Buffer, respond: ResponseFn) => void | Promise<void>;
    private _routeFn: (data: Buffer) => string;

    route(fn: (data: Buffer) => string) {
        this._routeFn = fn;
    }

    handleUnrouted(handler: (data: Buffer, respond: ResponseFn) => void | Promise<void>) {
        this._unaddressedHandler = handler;
    }

    addConnector(connector: Connector) {
        this._connectors.push(connector);
        connector.on("data", this.onData.bind(this))
    }

    addEndpoint(address: string, endpoint: RouterEndpoint) {
        this._map[address] = endpoint;
    }

    onData(data: Buffer, respond: ResponseFn) {
        const address = this._routeFn(data);
        if (address !== undefined && this._map[address]) {
            this._map[address].push(data, respond);
        } else {
            this._unaddressedHandler(data, respond);
        }
    }
}
