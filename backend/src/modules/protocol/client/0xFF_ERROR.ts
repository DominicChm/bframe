import {c_string, c_struct, end, uint16} from "c-type-util";
import {timestamp_header_ctype} from "../ctypes/timestamp_header";

/**
 * ERROR
 * =====
 * `<OP:uint8><ID:uint16><CODE:uint16><MSG:cString>`<br>
 * a CLIENT-INITIATED exchange between server and client that initializes the connection. This should be sent
 * as soon as a WS connection is confirmed with the server.
 *
 * Format Description
 * ------------------
 * | Field | Type | Value | Description |
 * | ----- | ---- | ----- | ----------- |
 * | OP | uint8 | 0xFF | The operation code. |
 * | ID | uint16 | | An ID assigned to the client by the first message received from the server in the `HANDSHAKE_RESPONSE` message. |
 * | TIMESTAMP | uint16 | | The server-synced timestamp when the error occurred. |
 * | CODE | uint16 | | A user-defined error code. |
 * | MSG | cString(256) | | A user-readable string describing the error. |
 */

export interface IClientError {
    id: number;
    timestamp: number;
    code: number;
    message: string;
}

const client_error_ctype = c_struct([
    {
        type: timestamp_header_ctype,
        name: "header",
    },
    {
        name: "code",
        type: uint16
    },
    {
        name: "msg",
        type: c_string(256)
    }
])

export function parse_ERROR(buf: Buffer, endian: "little" | "big" = "little"): IClientError {
    const data = end(client_error_ctype, endian).read(buf);

    return {
        code: data.code,
        message: data.msg,
        id: data.header.id,
        timestamp: data.header.timestamp
    }
}
