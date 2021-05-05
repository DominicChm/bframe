import {c_string, c_struct, end, uint16} from "c-type-util";
import {ITimestampHeader, timestamp_header_ctype} from "../ctypes/timestamp_header";

/**
 * ERROR
 * =====
 * `<OP:uint8><ID:uint16><TIMESTAMP:uint16><CODE:uint16><MSG:cString>`<br>
 * A generic error, passed from client to server
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

export interface IParticleError {
    id: number;
    timestamp: number;
    errorCode: number;
    message: string;
}

const client_error_ctype = c_struct<{
    header: ITimestampHeader,
    errorCode: number,
    message: string,
}>([
    {
        type: timestamp_header_ctype,
        name: "header",
    },
    {
        name: "errorCode",
        type: uint16
    },
    {
        name: "message",
        type: c_string(256)
    }
])

export function parse_ERROR(buf: Buffer, endian: "little" | "big" = "little"): IParticleError {
    const data = end(client_error_ctype, endian).read(buf);

    return {
        errorCode: data.errorCode,
        message: data.message,
        id: data.header.id,
        timestamp: data.header.timestamp
    }
}
