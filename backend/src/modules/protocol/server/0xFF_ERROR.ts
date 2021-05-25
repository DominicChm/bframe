import {cString, cStruct, end, uint16, uint8} from "c-type-util";

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

export const ServerErrorCT = cStruct({
    op: uint8,
    code: uint16,
    msg: cString(256),
})

export function serializeError(code: number, msg: string, endian: "little" | "big" = "little"): Buffer {
    return end(ServerErrorCT, endian).alloc({
        op: 0xFF,
        code,
        msg
    });
}
