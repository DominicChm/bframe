import {c_string} from "c-type-util";

/** Parses buffers in the format of <OP:uint8><TYPE:cString(64)><UID:cString(32)>
 */
export function parse_HANDSHAKE(buf: Buffer): { type, uid } {
    const type = c_string(64).readLE(buf, 1);
    const uid = c_string(32).readLE(buf, 65);
    return {type, uid};
}
