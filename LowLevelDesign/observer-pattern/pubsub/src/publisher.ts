import { Message } from "./message";
import { Topic } from "./topic";

export class Publisher {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    publish(topic: Topic, messageContent: string): void {
        topic.publish(new Message(messageContent))
    }
}