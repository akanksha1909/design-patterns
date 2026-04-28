import { Message } from "../entities/Message";
import { Subscriber } from "./Subscriber";

export class SimpleSubscriber implements Subscriber {
    private id: string;
    constructor(id) {
        this.id = id;
    }

    getId(): string {
        return this.id;
    }

    async onMessage(message: Message): Promise<void> {
        console.log(message.content);
        // simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}