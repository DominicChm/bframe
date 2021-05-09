import WebSocket from "ws";
import {compose_ERROR} from "../server/0xFF_ERROR";
import {logger} from "bc/logging";

const log = logger("Protocol Err Wrapper")
export function wrapProtocolError(fn: Function, ws: WebSocket) {
    return function (...arg) {
        try {
            fn(...arg);
        } catch (e) {
            log(e.stack, "error");
            ws.send(compose_ERROR(0x00, e.message));
        }
    }
}
