import {parse_HANDSHAKE} from "./parse_HANDSHAKE";
import {parse_ERROR} from "./parse_ERROR";
import {parse_STATE_UPDATE} from "./parse_STATE_UPDATE";

/**
 * Defines opcodes for packets incoming from clients.
 */
export enum EClientOp {
    HANDSHAKE = 0x00,
    STATE_UPDATE = 0x10,
    ERROR = 0xFF
}

export let client_op_parsers = [];

client_op_parsers[EClientOp.HANDSHAKE] = parse_HANDSHAKE;
client_op_parsers[EClientOp.STATE_UPDATE] = parse_STATE_UPDATE;
client_op_parsers[EClientOp.ERROR] = parse_ERROR;
