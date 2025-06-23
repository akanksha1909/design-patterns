import { Message } from "./message";
import { ISubscriber } from "./subscriber";

export class Topic {
    name: string;
    subscribers: Set<ISubscriber>;

    constructor(name: string) {
        this.name = name;
        this.subscribers = new Set();
    }

    addSubscriber(subscriber: ISubscriber): void {
        this.subscribers.add(subscriber)
    }

    removeSubscriber(subscriber: ISubscriber): void {
        this.subscribers.delete(subscriber)
    }

    publish(message: Message): void {
        for (const subscriber of this.subscribers) {
            subscriber.onMessage(this.name, message.content);
        }
    }
}