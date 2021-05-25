import WebSocket from "ws";
import util from "util";
import {Connector} from "./Connector";


export namespace WebsocketConnector {
    export interface Options {
        port: number
    }
}

export class WebsocketConnector extends Connector {
    private _wss: WebSocket.Server;

    constructor(options: WebsocketConnector.Options) {
        super();
        this._wss = new WebSocket.Server({port: options.port});
        this._wss.on("connection", this.onConnection.bind(this));
    }

    private onConnection(ws: WebSocket) {
        ws.on("message", (d) => this.onMessage(ws, d))
    }

    private onMessage(ws: WebSocket, data: WebSocket.Data) {
        const send = util.promisify(ws.send)
        if (data instanceof Array) { // Buffer[]
            data.forEach(d => this.push(d, send));
        } else {
            //@ts-ignore - Buffer.from DOES work on remaining types (string, Buffer, ArrayBuffer)
            this.push(Buffer.from(data), send);
        }
    }
}
