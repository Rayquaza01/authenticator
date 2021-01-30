import { Buffer } from "buffer";

const BASE_32_LOOKUP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function writeBufferBit(buf: Buffer, offset: number, data: number) {
    const byte = offset >> 3;
    const bit = offset & 0x7;

    buf[byte] |= (data & 0x1) << (7 - bit);
}

export function base32Decode(encoded: string): Buffer {
    const usedBits = encoded.length * 5;
    const bufferLength = Math.ceil(usedBits / 8);

    const buf = Buffer.alloc(bufferLength);

    let cursor = 0;
    for (let i = 0; i < encoded.length; i++) {
        const data = BASE_32_LOOKUP.indexOf(encoded[i]) & 0x1F;
        console.log("Encoding %i", data);
        if (data === 0x3D) { // =
            break;
        }

        for (let j = 0; j < 5; j++) {
            writeBufferBit(buf, cursor, data >> (4 - j));
            cursor++;
        }
    }

    return buf;
}
