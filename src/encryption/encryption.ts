const ENCRYPTION_SETTINGS = [
    {iterations: 1000000, salt: 32, iv: 12}
];
const LATEST_VERSION = 0;

async function generateKey(password: string, version: number, salt: Uint8Array): Promise<CryptoKey> {
    const encryptionSettings = ENCRYPTION_SETTINGS[version];

    const pwdBytes = new TextEncoder().encode(password);

    const imported = await crypto.subtle.importKey(
        "raw",
        pwdBytes,
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: encryptionSettings.iterations,
            hash: "SHA-256"
        },
        imported,
        {
            name: "AES-GCM",
            length: 256
        },
        false,
        ["encrypt", "decrypt"]
    );
}

export async function encrypt(data: string | Uint8Array, password: string): Promise<Uint8Array> {
    const encryptionSettings = ENCRYPTION_SETTINGS[LATEST_VERSION];

    const salt = crypto.getRandomValues(new Uint8Array(encryptionSettings.salt));
    const iv = crypto.getRandomValues(new Uint8Array(encryptionSettings.iv));

    if (typeof data === "string") {
        data = new TextEncoder().encode(data);
    }

    const key: CryptoKey = await generateKey(password, LATEST_VERSION, salt);

    const encrypted = new Uint8Array(await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        data
    ));

    const encryptedData = new Uint8Array(1 + encryptionSettings.salt + encryptionSettings.iv + encrypted.length);
    encryptedData[0] = LATEST_VERSION & 0xFF;
    encryptedData.set(salt, 1);
    encryptedData.set(iv, 1 + encryptionSettings.salt);
    encryptedData.set(encrypted, 1 + encryptionSettings.salt + encryptionSettings.iv);

    return encryptedData;
}

export async function decrypt(data: Uint8Array, password: string): Promise<Uint8Array> {
    const version = data[0];
    const encryptionSettings = ENCRYPTION_SETTINGS[version];
    const salt = data.slice(1, 1 + encryptionSettings.salt);
    const iv = data.slice(1 + encryptionSettings.salt, 1 + encryptionSettings.salt + encryptionSettings.iv);
    const encrypted = data.slice(1 + encryptionSettings.salt + encryptionSettings.iv, data.length);

    const key = await generateKey(password, version, salt);

    return new Uint8Array(await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encrypted
    ));
}
