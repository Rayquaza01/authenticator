import { readNBits, writeNBits } from "./BufReadWrite";
import { ModeInfo, Modes } from "./BaseModes";

/**
 * Decodes a base 32 or base 64 string to a buffer
 * @param encoded Base 32/64 string to decode
 * @param mode base32 or base64
 */
export function decode(encoded: string, mode: Modes): Uint8Array {
    let currentMode = ModeInfo[mode];

    if (!(encoded.match(currentMode.regex) && encoded.length % currentMode.minLength === 0)) {
        throw new Error("Encoded string is not the correct format");
    }

    encoded = encoded.replace(new RegExp(currentMode.padding, "g"), "");
    const buf = new Uint8Array(Math.floor(encoded.length * currentMode.bitsPerChar / 8));

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
    let currentMode = ModeInfo[mode];
    let result = "";

    let cursor = 0;
    while (cursor < buffer.length * 8) {
        let bitsToRead = (cursor + currentMode.bitsPerChar < buffer.length * 8)
            ? currentMode.bitsPerChar
            : buffer.length * 8 - cursor;

        let data = readNBits(buffer, cursor, bitsToRead) << (currentMode.bitsPerChar - bitsToRead);
        result += currentMode.alphabet[data]
        cursor += bitsToRead;
    }

    result = result.padEnd(currentMode.minLength * Math.ceil(result.length / currentMode.minLength), currentMode.padding);

    return result;
}
