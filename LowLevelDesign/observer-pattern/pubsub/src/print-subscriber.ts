// Subscriber Concrete Class

import { ISubscriber } from "./subscriber";

export class PrintSubscriber implements ISubscriber {
    private readonly _name: string;
    constructor(name: string) { 
        this._name = name
    }

    onMessage(topicName: string, message: string): void {
        console.log(`[${this._name}] received on '${topicName}': ${message}`);
    }
}