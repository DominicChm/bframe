import {cString, cStruct, end} from "c-type-util";
import {OpCT} from "../ctypes/OpCT";

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

export interface ParticleHandshake {
    op: number,
    typeName: string,
    uid: string
}

export const ParticleHandshakeCT = cStruct<ParticleHandshake>({
    op: OpCT,
    typeName: cString(64),
    uid: cString(32),
})

export function parseHandshake(data: Buffer, offset = 0, endian: "little" | "big" = "little"): ParticleHandshake {
    return end(ParticleHandshakeCT, endian).read(data)
}
