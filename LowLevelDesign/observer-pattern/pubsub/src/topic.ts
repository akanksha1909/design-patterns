import { Message } from "./message";
import { ISubscriber } from "./subscriber";

export class Topic {
    private readonly _name: string;
    private readonly _subscribers: Set<ISubscriber>;

    constructor(name: string) {
        this._name = name;
        this._subscribers = new Set();
    }

    addSubscriber(subscriber: ISubscriber): void {
        this._subscribers.add(subscriber)
    }

    removeSubscriber(subscriber: ISubscriber): void {
        this._subscribers.delete(subscriber)
    }

    publish(message: Message): void {
        for (const subscriber of this._subscribers) {
            subscriber.onMessage(this._name, message.content);
        }
    }
}