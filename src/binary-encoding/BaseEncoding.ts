import { writeNBits } from "./BufReadWrite";
import { PADDING, ModeInfo, Modes } from "./BaseModes";

/**
 * Decodes a base 32 or base 64 string to a buffer
 * @param encoded Base 32/64 string to decode
 * @param mode base32 or base64
 */
export function encode(encoded: string, mode: Modes): Uint8Array {
    let currentMode = ModeInfo[mode];

    encoded = encoded.replace(new RegExp(PADDING, "g"), "");
    const buf = new Uint8Array(Math.floor(encoded.length * currentMode.bitsPerChar / 8));

    let cursor = 0;
    for (let i = 0; i < encoded.length; i++) {
        const data = currentMode.alphabet.indexOf(encoded[i]);
        writeNBits(buf, cursor, data, currentMode.bitsPerChar);
        cursor += currentMode.bitsPerChar;
    }

    return buf;
}
