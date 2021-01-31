function numberToBytes(num: number): Uint8Array {
    const bytes = new Uint8Array(8);

    for (let i = 3; i >= 0; i--) {
        bytes[4 + i] = num & 0xFF;
        num = num >> 0x8;
    }

    return bytes;
}

export async function HOTP(key: string | Uint8Array, counter: number): Promise<string> {
    if (typeof key === "string") {
        key = new TextEncoder().encode(key);
    }

    const counterBuffer = numberToBytes(counter);

    const hmac = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign"])

    const HMACValue = new Uint8Array(await crypto.subtle.sign("HMAC", hmac, counterBuffer));

    // get 4 least significant bits for offset
    const offset = HMACValue[19] & 0xF;

    const value: number = (HMACValue[offset] & 0x7F) << 24 |
        (HMACValue[offset + 1] & 0xFF) << 16 |
        (HMACValue[offset + 2] & 0xFF) << 8 |
        (HMACValue[offset + 3] & 0xFF);

    // value % 10 ^ 6, for 6 digits, padded to 6 digits with 0
    return (value % (1000000)).toString().padStart(6, "0");
}
