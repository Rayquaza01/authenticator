import { readNBits, writeNBits } from "./BufReadWrite";
import { ModeInfo, Modes } from "./BaseModes";

/**
 * Decodes a base 32 or base 64 string to a buffer
 * @param encoded Base 32/64 string to decode
 * @param mode base32 or base64
 */
export function decode(encoded: string, mode: Modes): Uint8Array {
    const currentMode = ModeInfo[mode];

    // if given string fails validation regex, throw error
    if (!encoded.match(currentMode.regex)) {
        throw new Error("Encoded string is not the correct format");
    }

    // remove padding from string
    encoded = encoded.replace(new RegExp(currentMode.padding, "g"), "");
    const buf = new Uint8Array(Math.floor(encoded.length * currentMode.bitsPerChar / 8));

    // loop through string, writing each character's worth of bits to the result buffer
    let cursor = 0;
    for (let i = 0; i < encoded.length; i++) {
        const data = currentMode.alphabet.indexOf(encoded[i]);
        writeNBits(buf, cursor, data, currentMode.bitsPerChar);
        cursor += currentMode.bitsPerChar;
    }

    return buf;
}

/**
 * Encodes a buffer to base 32 or 64
 * @param buffer Buffer of data to encode
 * @param mode base32 or base64
 */
export function encode(buffer: Uint8Array, mode: Modes): string {
    const currentMode = ModeInfo[mode];
    let result = "";

    let cursor = 0;
    while (cursor < buffer.length * 8) {
        // if incrementing cursor is in buffer bounds, use bits per character
        // otherwise use however many bits are left in the buffer that haven't been read
        const bitsToRead = (cursor + currentMode.bitsPerChar < buffer.length * 8)
            ? currentMode.bitsPerChar
            : buffer.length * 8 - cursor;

        // read bits from buffer
        // shift so that first bit read is always the most significant
        const data = readNBits(buffer, cursor, bitsToRead) << (currentMode.bitsPerChar - bitsToRead);
        result += currentMode.alphabet[data];
        cursor += bitsToRead;
    }

    // pad end of string to multiple length with padding character
    result = result.padEnd(currentMode.minLength * Math.ceil(result.length / currentMode.minLength), currentMode.padding);

    return result;
}
