export interface BaseMode {
    bitsPerChar: number
    alphabet: string
    padding: string
    minLength: number
    regex: RegExp
}

export type Modes = "base32" | "base64" | "hex";

export const ModeInfo: Record<Modes, BaseMode> = {
    base32: {
        bitsPerChar: 5,
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        padding: "=",
        minLength: 8,
        regex: /^[A-Z2-7]*=*$/
    },
    base64: {
        bitsPerChar: 6,
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        padding: "=",
        minLength: 4,
        regex: /^[A-Za-z0-9+/]*=*$/
    },
    hex: {
        bitsPerChar: 4,
        alphabet: "0123456789ABCDEF",
        padding: "=",
        minLength: 2,
        regex: /^[0-9A-F]*=*$/
    }
};
