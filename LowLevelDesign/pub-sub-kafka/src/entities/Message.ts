export class Message {
    constructor(public readonly content: string) { }
    getMessage(): string {
        return this.content;
    }
}