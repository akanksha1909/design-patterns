// Publisher Concrete Class

import { Message } from "./message";
import { Topic } from "./topic";

export class Publisher {
    private readonly _name: string;
    constructor(name: string) {
        this._name = name;
    }

    publish(topic: Topic, messageContent: string): void {
        topic.publish(new Message(messageContent))
    }
}