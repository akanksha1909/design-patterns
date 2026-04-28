import { Subscriber } from "../subscribers/Subscriber";
import { Topic } from "./Topic";

export class TopicSubscriber {
    private topic: Topic;
    private subscriber: Subscriber;
    private offset: number;
    private isRunning: boolean;
    constructor(topic, subscriber: Subscriber) {
        this.topic = topic;
        this.subscriber = subscriber;
        this.offset = 0;
        this.isRunning = true;
    }

    getRunning() {
        return this.isRunning;
    }

    getMessages() {
        return this.topic.getMessages();
    }

    getOffset() {
        return this.offset;
    }

    setOffset(offset: number) {
        this.offset = offset;
    }
    getSubscriber() {
        return this.subscriber;
    }
}