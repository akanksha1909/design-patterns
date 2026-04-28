import { Message } from "./Message";

export class Topic {
    private topicName: string;
    private topicId: string;
    private messages: Message[];
    constructor(topicName, topicId) {
        this.topicName = topicName;
        this.topicId = topicId;
        this.messages = [];
    }

    addMessage(message: Message) {
        this.messages.push(message);
    }

    getMessages() {
        return this.messages;
    }

    getTopicName() {
        return this.topicName;
    }

    getTopicId() {
        return this.topicId;
    }
}