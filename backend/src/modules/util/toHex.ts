export function toHex(number: number): string {
    const hex_length = Math.ceil(Math.log2(number + 1) / 8) * 2
    const padding = '0'.repeat(hex_length);
    return `0x${(padding + number.toString(16).toUpperCase()).slice(-hex_length)}`
}
