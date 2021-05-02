/**
 * STATE UPDATE
 * =====
 * `<OP:uint8><DATA>`<br>
 * A server -> client state update.
 *
 * Format Description
 * ------------------
 * | Field | Type | Value | Description |
 * | ----- | ---- | ----- | ----------- |
 * | OP | uint8 | 0x10 | The operation code. |
 * | CODE | uint16 | | A user-defined error code. |
 * | MSG | cString(256) | | A user-readable string describing the error. |
 */
import {opcode_ctype} from "../ctypes/opcode";

export function compose_STATE_UPDATE(data: Buffer, endian: "little" | "big" = "little"): Buffer {
    const buf = Buffer.alloc(data.length + 1);

    opcode_ctype.writeLE(0x10, buf);
    data.copy(buf, 1);

    return buf
}
