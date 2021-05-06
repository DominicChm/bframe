import WebSocket from "ws";
import {IParticleHandshake, parse_HANDSHAKE} from "../client/0x00_HANDSHAKE";
import {compose_ERROR} from "../server/0xFF_ERROR";

/**
 * Waits for an incoming handshake, and responds with whatever message is returned from
 * the passed handler.
 * @param ws
 * @param callback
 */
export function handle_handshake(ws: WebSocket, callback: (particle_info: IParticleHandshake, ws: WebSocket) => Buffer) {
    //Use arrow fn to avoid rebinding `this`
    const handleMessage = (message: WebSocket.Data) => {
        if (message instanceof Buffer) {
            try {
                const return_msg = callback(parse_HANDSHAKE(message), ws);
                ws.send(return_msg);
                ws.removeListener("message", handleMessage);
            } catch (e) {
                ws.send(compose_ERROR(0x00, e.message));
            }
        } else {
            ws.close();
            throw new Error("Received non-buffer or non-handshake opcode message during handshake!");
        }
    }

    ws.on("message", handleMessage);
}
