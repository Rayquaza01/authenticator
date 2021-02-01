import { HOTP } from "./HOTP";
import { Base32 } from "../binary-encoding/Base32";

const INTERVAL = 30;

export async function TOTP(key: string): Promise<string> {
    // must base 32 decode key to be compatible with google authenticator

    const decodedKey = Base32.decode(key);

    const counter = Math.floor(Math.floor(Date.now() / 1000) / INTERVAL);

    return await HOTP(decodedKey, counter);
}
