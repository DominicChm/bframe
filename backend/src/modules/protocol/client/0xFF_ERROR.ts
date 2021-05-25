import {cString, cStruct, uint16} from "c-type-util";
import {TimestampHeader, TimestampHeaderCT} from "../ctypes/TimestampHeaderCT";

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

export const ParticleErrorCT = cStruct<{
    header: TimestampHeader
    errorCode: number,
    message: string,
}>({
    header: TimestampHeaderCT,
    errorCode: uint16,
    message: cString(256),
})
