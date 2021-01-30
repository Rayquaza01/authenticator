import { HOTP } from "./HOTP";

const INTERVAL = 30;

export function TOTP(key: string): string {
    const counter = Math.floor(Math.floor(Date.now() / 1000) / INTERVAL);

    return HOTP(key, counter);
}
