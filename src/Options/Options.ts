const colorRegex = /^#[0-9A-F]{6}$/;

export interface OptionsInterface {
    fontColor: string
    backgroundColor: string
}

export class Options {
    fontColor = "#000000";
    backgroundColor = "#FFFFFF";

    constructor(data?: Partial<OptionsInterface>) {
        this.setFontColor(data?.fontColor);
        this.setBackgroundColor(data?.backgroundColor);
    }

    setFontColor(c?: string): void {
        if (typeof c === "string" && c.match(colorRegex)) {
            this.fontColor = c;
        }
    }

    setBackgroundColor(c?: string): void {
        if (typeof c === "string" && c.match(colorRegex)) {
            this.backgroundColor = c;
        }
    }
}
