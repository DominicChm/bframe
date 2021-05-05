export function toSpacedHex(number: number): string {
    const hex_length = Math.ceil(Math.log2(number + 1) / 8) * 2
    const padding = '0'.repeat(hex_length);
    return `${(padding + number.toString(16).toUpperCase()).slice(-hex_length)}`.replace(/(.{2})/g," ")
}
