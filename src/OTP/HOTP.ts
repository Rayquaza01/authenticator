import crypto from "crypto";
import { Buffer } from "buffer";

function numberToBytes(num: number): Buffer {
    const bytes = Buffer.alloc(8);

    for (let i = 3; i >= 0; i--) {
        bytes[4 + i] = num & 0xFF;
        num = num >> 0x8;
    }

    return bytes;
}

export function HOTP(key: string | Buffer, counter: number): string {
    if (typeof key === "string") {
        key = Buffer.from(key);
    }

    const counterBuffer = numberToBytes(counter);

    const hmac = crypto.createHmac("sha1", key);

    const digest = hmac.update(counterBuffer).digest("hex");

    const HMACValue = Buffer.from(digest, "hex");

    // get 4 least significant bits for offset
    const offset = HMACValue[19] & 0xF;

    const value: number = (HMACValue[offset] & 0x7F) << 24 |
        (HMACValue[offset + 1] & 0xFF) << 16 |
        (HMACValue[offset + 2] & 0xFF) << 8 |
        (HMACValue[offset + 3] & 0xFF);

    // value % 10 ^ 6, for 6 digits, padded to 6 digits with 0
    return (value % (1000000)).toString().padStart(6, "0");
}
