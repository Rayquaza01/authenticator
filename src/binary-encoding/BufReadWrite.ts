/**
 * Writes to a buffer **count** bits at a time
 * @param buf Buffer to write to
 * @param address Address to start writing at
 * @param data Data to write (only the **count** lowest bits are used)
 * @param count Number of bits to write from **data**, must be 8 or less
 */
export function writeNBits(buf: Uint8Array, address: number, data: number, count: number): void {
    const byte = address >> 0x3;
    const bit = address & 0x7;

    data = (data & (2 ** count - 1));

    let shiftBy = Math.abs(bit - (8 - count));

    if (bit <= 8 - count) {
        buf[byte] |= data << shiftBy;
    } else {
        buf[byte] |= data >> shiftBy;
        buf[byte + 1] |= data << (8 - shiftBy);
    }
}

export function readNBits(buf: Readonly<Uint8Array>, address: number, count: number): number {
    let result = 0;

    const byte = address >> 0x3;
    const bit = address & 0x7;

    let shiftBy = Math.abs(bit - (8 - count));

    if (bit <= 8 - count) {
        result = buf[byte] >> shiftBy;
    } else {
        result = buf[byte] << shiftBy;
        result |= buf[byte + 1] >> (8 - shiftBy);
    }

    return result;
}
