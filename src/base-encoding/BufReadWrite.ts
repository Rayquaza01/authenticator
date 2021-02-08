/**
 * Writes to a buffer **count** bits at a time
 * @param buf Buffer to write to
 * @param address Address to start writing at
 * @param data Data to write to buffer
 * @param count Number of bits to write
 */
export function writeNBits(buf: Uint8Array, address: number, data: number, count: number): void {
    // convert address to bit and byte
    const byte = address >> 0x3;
    const bit = address & 0x7;

    // mask, isolates the last count bits of a number
    data = (data & (2 ** count - 1));

    // number of bits to shift in order to get first bit to be the count bit
    const shiftBy = Math.abs(bit - (8 - count));

    // if current write falls within a single byte, write the data to that byte
    if (bit <= 8 - count) {
        buf[byte] |= data << shiftBy;
    }
    // if current write falls on a boundary between two bytes, write to the end of the
    // first byte, and write what couldn't fit in the first byte to the start of the next
    else {
        buf[byte] |= data >> shiftBy;
        buf[byte + 1] |= data << (8 - shiftBy);
    }
}

/**
 * Read from a buffer **count** bits at a time
 * @param buf Buffer to read from
 * @param address Address to start reading from
 * @param count Number of bits to read
 */
export function readNBits(buf: Readonly<Uint8Array>, address: number, count: number): number {
    // basically the same as writeNBits, but reads from the buffer and writes to a number

    let result = 0;

    const byte = address >> 0x3;
    const bit = address & 0x7;

    const mask = 2 ** count - 1;

    const shiftBy = Math.abs(bit - (8 - count));

    if (bit <= 8 - count) {
        result = (buf[byte] >> shiftBy) & mask;
    } else {
        result = (buf[byte] << shiftBy) & mask;
        result |= buf[byte + 1] >> (8 - shiftBy);
    }

    return result;
}
