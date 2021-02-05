export const BASE_32_LOOKUP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export const BASE_64_LOOKUP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export const PADDING = "=";

export interface BaseMode {
    bitsPerChar: number
    alphabet: string
};

export type Modes = "base32" | "base64";

export const ModeInfo: Record<Modes, BaseMode>  = {
    base32: {
        bitsPerChar: 5,
        alphabet: BASE_32_LOOKUP
    },
    base64: {
        bitsPerChar: 6,
        alphabet: BASE_64_LOOKUP
    }
};
