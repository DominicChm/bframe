import {parse_ERROR} from "./client/0xFF_ERROR";
import {compose_STATE_UPDATE} from "./server/0x10_STATE_UPDATE";
import {compose_HANDSHAKE_RESPONSE} from "./server/0x00_HANDSHAKE_RESPONSE";

/**
 * Defines opcodes for packets incoming from clients.
 */
export enum EServerOp {
    HANDSHAKE_RESPONSE = 0x00,
    STATE_UPDATE = 0x10,
    ERROR = 0xFF
}

export let server_op_parsers = [];

server_op_parsers[EServerOp.HANDSHAKE_RESPONSE] = compose_HANDSHAKE_RESPONSE;
server_op_parsers[EServerOp.STATE_UPDATE] = compose_STATE_UPDATE;
server_op_parsers[EServerOp.ERROR] = parse_ERROR;
