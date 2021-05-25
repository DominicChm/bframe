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
 * | DATA | any | | A generated data patch. |
 */
import {OpCT} from "../ctypes/OpCT";
import {end} from "c-type-util";
import {EServerOp} from "../server_opcodes";

export function composeStateUpdate(data: Buffer, endian: "little" | "big" = "little") {
    const op = end(OpCT, endian).alloc(EServerOp.HANDSHAKE_RESPONSE);
    return Buffer.concat([op, data])
}
