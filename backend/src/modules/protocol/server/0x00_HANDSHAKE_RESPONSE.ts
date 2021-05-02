import {c_struct, end, uint16} from "c-type-util";
import {opcode_ctype} from "../ctypes/opcode";

/**
 * HANDSHAKE
 * =========
 * `<OP:uint8><ID:uint16>`<br>
 * The server response to a CLIENT-INITIATED handshake.
 * NOTE: THIS IS ONLY SENT IF THE CLIENT HANDSHAKE IS VALID - AN INVALID HANDSHAKE WILL RESULT IN AN ERROR BEING SENT
 * INSTEAD OF THIS MESSAGE!
 *
 * Format Description
 * ------------------
 * | Field | Type | Value | Description |
 * | ----- | ---- | ----- | ----------- |
 * | OP | uint8 | 0x00 |The operation code. In this case, 0x00 |
 * | ID | uint16 | | A unique ID assigned to the client to identify it for the duration of its connection. |
 *
 */

export interface IHandshake {
    type: string,
    uid: string,
}

const handshake_ctype = c_struct([
    {
        name: "op",
        type: opcode_ctype
    },
    {
        name: "id",
        type: uint16
    }
])

export function compose_HANDSHAKE_RESPONSE(id, endian: "little" | "big" = "little"): Buffer {
    const buf = Buffer.alloc(handshake_ctype.size);
    end(handshake_ctype, endian).write({
        op: 0x000,
        id
    }, buf);

    return buf
}
