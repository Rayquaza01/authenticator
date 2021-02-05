/**
 * Writes to a buffer **count** bits at a time
 * @param buf Buffer to write to
 * @param address Address to start writing at
 * @param data Data to write (only the **count** lowest bits are used)
 * @param count Number of bits to write from **data**, must be 8 or less
 */
export function writeNBits(buf: Uint8Array, address: number, data: number, count: number): void {
    if (count > 8 || count < 0) {
        throw new RangeError("Can only write 8 or less bits at a time")
    }

    const byte = address >> 3;
    const bit = address & 0x7;

    data = (data & (2 ** count - 1));

    let shiftBy = Math.abs(bit - (8 - count));

    if (bit <= 8 - count) {
        buf[byte] |= data << shiftBy;
    } else {
        buf[byte] |= data >> shiftBy;
        buf[byte + 1] |= data << (8 - shiftBy);
    }

    if (buf[byte] === 0) {
        console.log(address, data, count)
    }
}
