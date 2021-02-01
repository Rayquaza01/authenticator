const BASE_32_LOOKUP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Writes to a buffer 5 bits at a time
 * @param buf Buffer to write to
 * @param cursor Address to start writing at
 * @param data Data to write (only the five lowest bits are used)
 */
function write5Bits(buf: Uint8Array, cursor: number, data: number): void {
    const byte = cursor >> 3;
    const bit = cursor & 0x7;

    data = (data & 0x1F);

    let shiftBy = Math.abs(bit - 3);

    if (bit <= 3) {
        buf[byte] |= data << shiftBy;
    } else {
        buf[byte] |= data >> shiftBy;
        buf[byte + 1] |= data << (8 - shiftBy);
    }
}

/**
 * Encodes a buffer to a base 32 string
 * @param data Buffer to encode
 */
export function base32Encode(data: Uint8Array): string {
    let encoded = "";

    return encoded;
}

/**
 * Decodes a base 32 string to a buffer
 * @param encoded Base 32 string to decode
 */
export function base32Decode(encoded: string): Uint8Array {
    encoded = encoded.replace(/=/g, "");
    const buf = new Uint8Array(Math.floor(encoded.length * 5 / 8));

    let cursor = 0;
    for (let i = 0; i < encoded.length; i++) {
        const data = BASE_32_LOOKUP.indexOf(encoded[i]) & 0x1F;
        if (encoded[i] === "=") {
            break;
        }

        write5Bits(buf, cursor, data);
        cursor += 5;
    }

    return buf;
}
