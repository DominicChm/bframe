import {cStruct, end} from "c-type-util";
import {RidCT} from "../ctypes/RidCT";
import {OpCT} from "../ctypes/OpCT";
import {EServerOp} from "../server_opcodes";

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

export interface HandshakeResponse {
    op: number,
    rid: number,
}

export const HandshakeResponseCT = cStruct<HandshakeResponse>({
    op: OpCT,
    rid: RidCT
})

export function serializeHandshakeResponse(rid: number, endian: "little" | "big" = "little"): Buffer {
    return end(HandshakeResponseCT, endian).alloc({
        op: EServerOp.HANDSHAKE_RESPONSE,
        rid: rid
    });
}
