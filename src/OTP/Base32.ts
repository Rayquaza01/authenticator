const BASE_32_LOOKUP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

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

function base32Encode(data: Uint8Array): string {
    let encoded = "";

    return encoded;
}

function base32Decode(encoded: string): Uint8Array {
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

export default {
    encode: base32Encode,
    decode: base32Decode
}
