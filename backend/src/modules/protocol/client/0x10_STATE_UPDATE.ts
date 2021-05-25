import {end} from "c-type-util";
import {TimestampHeaderCT} from "../ctypes/TimestampHeaderCT";

/**
 * STATE_UPDATE
 * ============
 * `<OP:uint8><ID:uint16><TIMESTAMP:uint16><DATA>`<br>
 * a CLIENT-INITIATED exchange between server and client that initializes the connection. This should be sent
 * as soon as a WS connection is confirmed with the server.
 *
 * Format Description
 * ------------------
 * | Field | Type | Value | Description |
 * | ----- | ---- | ----- | ----------- |
 * | OP | uint8 | 0x10 | The operation code. |
 * | ID | uint16 | | An ID assigned to the client by the first message received from the server in the `HANDSHAKE_RESPONSE` message. |
 * | TIMESTAMP | uint16 | | The timestamp the readings are linked to (i.e. ideally, when they are taken). This value should be synchronized with the server utilizing `TIME_SYNC` messages |
 * | DATA | Buffer | | An update (`data`) to the variable that corresponds with `INDEX`. `data` is of arbitrary length, and can represent anything from a uint8 to a char array (string). Variable-index pairs are determined by the core when Module.h is generated from a module definition. They must match between the server and client. |
 *
 */

export interface IClientStateUpdate {
    rid: number,
    timestamp: number,
    data: Buffer
}

export function parseStateUpdate(buf: Buffer, endian: "little" | "big" = "little"): IClientStateUpdate {
    const header_data = end(TimestampHeaderCT, endian).read(buf);

    return {
        rid: header_data.rid,
        timestamp: header_data.timestamp,
        data: buf.slice(TimestampHeaderCT.size)
    }
}
