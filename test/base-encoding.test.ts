import { encode, decode } from "../src/base-encoding/BaseEncoding";
import { expect } from "chai";
import "mocha";

const binaryData = new Uint8Array([80,75,3,4,20,0,8,0,8,0,55,149,62,82,0,0,0,0,0,0,0,0,69,0,0,0,10,0,32,0,46,103,105,116,105,103,110,111,114,101,85,84,13,0,7,187,238,21,96,115,179,29,96,187,238,21,96,117,120,11,0,1,4,232,3,0,0,4,232,3,0,0,13,200,49,10,192,32,12,0,192,61,79,17,52,159,233,94,98,146,162,160,181,52,17,251,252,186,220,112,33,217,122,32,108,7,28,101,246,108,73,50,220,67,244,236,67,102,83,67,88,154,163,126,30,233,245,122,17,251,46,169,230,8,137,137,139,34,252,80,75,7,8,49,95,202,215,67,0,0,0,69,0,0,0,80,75,1,2,20,3,20,0,8,0,8,0,55,149,62,82,49,95,202,215,67,0,0,0,69,0,0,0,10,0,32,0,0,0,0,0,0,0,0,0,180,129,0,0,0,0,46,103,105,116,105,103,110,111,114,101,85,84,13,0,7,187,238,21,96,115,179,29,96,187,238,21,96,117,120,11,0,1,4,232,3,0,0,4,232,3,0,0,80,75,5,6,0,0,0,0,1,0,1,0,88,0,0,0,155,0,0,0,0,0]);
const binaryBase64 = "UEsDBBQACAAIADeVPlIAAAAAAAAAAEUAAAAKACAALmdpdGlnbm9yZVVUDQAHu+4VYHOzHWC77hVgdXgLAAEE6AMAAAToAwAADcgxCsAgDADAPU8RNJ/pXmKSoqC1NBH7/LrccCHZeiBsBxxl9mxJMtxD9OxDZlNDWJqjfh7p9XoR+y6p5giJiYsi/FBLBwgxX8rXQwAAAEUAAABQSwECFAMUAAgACAA3lT5SMV/K10MAAABFAAAACgAgAAAAAAAAAAAAtIEAAAAALmdpdGlnbm9yZVVUDQAHu+4VYHOzHWC77hVgdXgLAAEE6AMAAAToAwAAUEsFBgAAAAABAAEAWAAAAJsAAAAAAA==";
const binaryBase32 = "KBFQGBAUAAEAACAAG6KT4UQAAAAAAAAAAAAEKAAAAAFAAIAAFZTWS5DJM5XG64TFKVKA2AAHXPXBKYDTWMOWBO7OCVQHK6ALAAAQJ2ADAAAAJ2ADAAAA3SBRBLACADAAYA6U6EJUT7UV4YUSUKQLKNAR7P6LVXDQEHMXUIDMA4OGL5TMJEZNYQ7U5RBWMU2DLCNKG7Q65H2XUEP3F2U6MCEJRGFSF7CQJMDQQMK7ZLLUGAAAABCQAAAAKBFQCAQUAMKAACAABAADPFJ6KIYV7SWXIMAAAACFAAAAACQAEAAAAAAAAAAAAAAAWSAQAAAAAAXGO2LUNFTW433SMVKVIDIAA6564FLAOOZR2YF35YKWA5LYBMAACBHIAMAAABHIAMAAAUCLAUDAAAAAAAAQAAIALAAAAAE3AAAAAAAA";

const text = "The quick brown fox jumps over the lazy dog.";
const textData = new TextEncoder().encode(text);
const textBase64 = "VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=";
const textBase32 = "KRUGKIDROVUWG2ZAMJZG653OEBTG66BANJ2W24DTEBXXMZLSEB2GQZJANRQXU6JAMRXWOLQ="

const emptyData = new Uint8Array();
const emptyString = "";

const notBaseEncoded = "This string is not a correctly formatted base 32 or base 64 string!";

describe("Encode", () => {
    it("should encode a sentence to base 64", () => {
        const result = encode(textData, "base64");
        expect(result).to.equal(textBase64);
    });

    it("should encode a sentence to base 32", () => {
        const result = encode(textData, "base32");
        expect(result).to.equal(textBase32);
    });

    it("should encode binary data to base 64", () => {
        const result = encode(binaryData, "base64");
        expect(result).to.equal(binaryBase64);
    });

    it("should encode binary data to base 32", () => {
        const result = encode(binaryData, "base32");
        expect(result).to.equal(binaryBase32);
    });

    it("should encode empty data to base 64", () => {
        const result = encode(emptyData, "base64");
        expect(result).to.equal(emptyString);
    });

    it("should encode empty data to base 32", () => {
        const result = encode(emptyData, "base32");
        expect(result).to.equal(emptyString);
    });
});

describe("Decode", () => {
    it("should decode a sentence from base 64", () => {
        const result = decode(textBase64, "base64");
        const resultText = new TextDecoder().decode(result);
        expect(resultText).to.equal(text);
    });

    it("should decode a sentence from base 32", () => {
        const result = decode(textBase32, "base32");
        const resultText = new TextDecoder().decode(result);
        expect(resultText).to.equal(text);
    });

    it("should decode binary data from base 64", () => {
        const result = decode(binaryBase64, "base64");
        expect(result.toString()).to.equal(binaryData.toString());
    });

    it("should decode binary data from base 32", () => {
        const result = decode(binaryBase32, "base32");
        expect(result.toString()).to.equal(binaryData.toString());
    });

    it("should decode empty data from base 64", () => {
        const result = decode(emptyString, "base64");
        expect(result.toString()).to.equal(emptyData.toString());
    });

    it("should decode empty data from base 32", () => {
        const result = decode(emptyString, "base32");
        expect(result.toString()).to.equal(emptyData.toString());
    })

    it("should fail to decode a badly formatted string, base 64", () => {
        expect(() => decode(notBaseEncoded, "base64")).to.throw(new Error("Encoded string is not the correct format"));
    });

    it("should fail to decode a badly formatted string, base 32", () => {
        expect(() => decode(notBaseEncoded, "base32")).to.throw(new Error("Encoded string is not the correct format"));
    });
});
