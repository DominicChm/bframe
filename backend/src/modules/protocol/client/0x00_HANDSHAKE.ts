import {c_string, c_struct, end} from "c-type-util";
import {opcode_ctype} from "../ctypes/opcode";

/**
 * HANDSHAKE
 * =========
 * `<OP:uint8><TYPE:cString(64)><UID:cString(32)>`<br>
 * a CLIENT-INITIATED exchange between server and client that initializes the connection. This should be sent
 * as soon as a WS connection is confirmed with the server.
 *
 * Format Description
 * ------------------
 * | Field | Type | Value | Description |
 * | ----- | ---- | ----- | ----------- |
 * | OP | uint8 | 0x00 |The operation code. In this case, 0x00 |
 * | TYPE | cString(64) | | The type describes the type of the module connecting. Each module type should have a unique TYPE that is consistent between all different modules. This can be thought of as a model identifier. For example, a motor driver for a roomba motor might have a type of `ROOMBA_MOTOR_DRIVER_V1`. |
 * | UID | cString(32) | | A unique ID that can be used to identify individual modules. This should usually be the internal MAC of the ESP chip in the format of `XX:XX:XX:XX:XX:XX` |
 *
 */

export interface IParticleHandshake {
    [key: string]: any

    op: number,
    typeName: string,
    uid: string
}

export const handshake_ctype = c_struct<IParticleHandshake>([
    {
        name: "op",
        type: opcode_ctype
    },
    {
        name: "typeName",
        type: c_string(64)
    },
    {
        name: "uid",
        type: c_string(32)
    }
])

export function parse_HANDSHAKE(buf: Buffer, endian: "little" | "big" = "little"): IParticleHandshake {
    return end(handshake_ctype, endian).read(buf);

}
