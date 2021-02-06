export const BASE_32_LOOKUP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export const BASE_64_LOOKUP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export interface BaseMode {
    bitsPerChar: number
    alphabet: string
    padding: string
    minLength: number
    regex: RegExp
};

export type Modes = "base32" | "base64";

export const ModeInfo: Record<Modes, BaseMode>  = {
    base32: {
        bitsPerChar: 5,
        alphabet: BASE_32_LOOKUP,
        padding: "=",
        minLength: 8,
        regex: /^[A-Z2-7]*=*$/
    },
    base64: {
        bitsPerChar: 6,
        alphabet: BASE_64_LOOKUP,
        padding: "=",
        minLength: 4,
        regex: /^[A-Za-z0-9+/]*=*$/
    }
};
