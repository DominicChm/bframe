/**
 * Defines opcodes for packets incoming from clients.
 */
export enum EServerOp {
    HANDSHAKE_RESPONSE = 0x00,
    STATE_UPDATE = 0x10,
    ERROR = 0xFF
}
