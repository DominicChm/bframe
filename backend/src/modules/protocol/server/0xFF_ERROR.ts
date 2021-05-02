import {c_string, c_struct, end, uint16, uint8} from "c-type-util";
import {timestamp_header_ctype} from "../ctypes/timestamp_header";

/**
 * ERROR
 * =====
 * `<OP:uint8><CODE:uint16><MSG:cString>`<br>
 * A generic error, passed from server to client
 *
 * Format Description
 * ------------------
 * | Field | Type | Value | Description |
 * | ----- | ---- | ----- | ----------- |
 * | OP | uint8 | 0xFF | The operation code. |
 * | CODE | uint16 | | A user-defined error code. |
 * | MSG | cString(256) | | A user-readable string describing the error. |
 */

const client_error_ctype = c_struct([
    {
        type: uint8,
        name: "op",
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

export function compose_ERROR(code: number, msg: string, endian: "little" | "big" = "little"): Buffer {
    const buf = Buffer.alloc(client_error_ctype.size);
    end(client_error_ctype, endian).write({
        op: 0xFF,
        code,
        msg
    }, buf);

    return buf;
}
