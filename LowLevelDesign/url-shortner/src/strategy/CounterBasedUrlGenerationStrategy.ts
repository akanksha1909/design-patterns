import { UrlGenerationStrategy } from "./UrlGenerationStrategy";

export class CounterBasedUrlGenerationStrategy implements UrlGenerationStrategy {
    private counter: number;
    private letters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private base = this.letters.length;

    constructor() {
        this.counter = 0;
    }

    public generateShortUrl(): string {
        this.counter += 1;
        return this.encode(this.counter);
    }

    private encode(num: number): string {
        if (num === 0) return this.letters[0];
        let str = '';
        while (num > 0) {
            str = this.letters[num % this.base] + str;
            num = Math.floor(num / this.base);
        }
        return str;
    }

    // decode(str: string): number {
    //     let num = 0;
    //     for (let i = 0; i < str.length; i++) {
    //         num = num * BASE + ALPHABET.indexOf(str[i]);
    //     }
    //     return num;
    // }
}