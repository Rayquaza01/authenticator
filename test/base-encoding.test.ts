import { encode, decode } from "../src/base-encoding/BaseEncoding";
import { expect } from "chai";
import "mocha";

describe("Encode", () => {
    it("should encode a sentence to base 64", () => {
        const data = new TextEncoder().encode("The quick brown fox jumps over the lazy dog.");
        const result = encode(data, "base64");
        expect(result).to.equal("VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=");
    });

    it("should encode a sentence to base 32", () => {
        const data = new TextEncoder().encode("The quick brown fox jumps over the lazy dog.");
        const result = encode(data, "base32");
        expect(result).to.equal("KRUGKIDROVUWG2ZAMJZG653OEBTG66BANJ2W24DTEBXXMZLSEB2GQZJANRQXU6JAMRXWOLQ=");
    });
});

describe("Decode", () => {
    it("should decode a sentence from base 64", () => {
        const data = "VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=";
        const result = decode(data, "base64");
        const resultText = new TextDecoder().decode(result);
        expect(resultText).to.equal("The quick brown fox jumps over the lazy dog.");
    });

    it("should decode a sentence from base 32", () => {
        const data = "KRUGKIDROVUWG2ZAMJZG653OEBTG66BANJ2W24DTEBXXMZLSEB2GQZJANRQXU6JAMRXWOLQ="
        const result = decode(data, "base32");
        const resultText = new TextDecoder().decode(result);
        expect(resultText).to.equal("The quick brown fox jumps over the lazy dog.");
    });
});
