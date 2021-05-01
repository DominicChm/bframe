export function compose_STATE_UPDATE(data: Buffer, endian: "little" | "big" = "little"): Buffer {
    const buf = Buffer.alloc(data.length + 1);

    buf.writeUInt8(0x00);
    data.copy(buf, 1);

    return buf
}
