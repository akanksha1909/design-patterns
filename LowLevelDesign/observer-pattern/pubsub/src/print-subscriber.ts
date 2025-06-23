// Subscriber Concrete Class

import { ISubscriber } from "./subscriber";

export class PrintSubscriber implements ISubscriber {
    name: string;
    constructor(name: string) { 
        this.name = name
    }

    onMessage(topicName: string, message: string): void {
        console.log(`[${this.name}] received on '${topicName}': ${message}`);
    }
}