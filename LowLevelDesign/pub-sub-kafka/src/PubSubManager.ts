import { Topic } from "./entities/Topic";
import { v4 as uuidv4 } from 'uuid';
import { TopicSubscriber } from "./entities/TopicSubscriber";
import { Subscriber } from "./subscribers/Subscriber";
import { TopicSubscriberManager } from "./TopicSubscriberManager";
import { Message } from "./entities/Message";

export class PubSubManager {
    private static instance: PubSubManager;
    private topics: Map<string, Topic>;
    private topicSubscribers: Map<string, TopicSubscriber[]>;
    private constructor() {
        this.topics = new Map<string, Topic>();
        this.topicSubscribers = new Map<string, TopicSubscriber[]>();
    }

    static getInstance() {
        if (!PubSubManager.instance) {
            PubSubManager.instance = new PubSubManager();
        }
        return PubSubManager.instance;
    }

    createTopic(topicName: string) {
        const topic = new Topic(topicName, uuidv4());
        this.topics.set(topic.getTopicId(), topic);
        this.topicSubscribers.set(topic.getTopicId(), []);
        return topic;
    }

    subscribe(topicId: string, subscriber: Subscriber) {
        const topic = this.topics.get(topicId);
        if (!topic) {
            throw new Error(`Topic ${topicId} not found`);
        }
        const topicSubscriber = new TopicSubscriber(topic, subscriber);
        this.topicSubscribers.get(topicId).push(topicSubscriber);
        const topicSubscriberManager = new TopicSubscriberManager(topicSubscriber);
        topicSubscriberManager.start(); // no Thread - async loop
        console.log(`Subscriber ${subscriber.getId()} subscribed to topic ${topic.getTopicName()}`);
    }

    publish(topicId: string, message: Message) {
        const topic = this.topics.get(topicId);
        if (!topic) {
            throw new Error(`Topic ${topicId} not found`);
        }
        topic.addMessage(message);
        console.log(
            `Message "${message.getMessage()}" published to topic: ${topic.getTopicName()}`
        );
    }

    resetOffset(topicId, subscriber, newOffset) {
        const topic = this.topics.get(topicId);
        if (!topic) {
            throw new Error(`Topic ${topicId} not found`);
        }
        const topicSubscriber = this.topicSubscribers.get(topicId).find(ts => ts.getSubscriber().getId() === subscriber.getId());
        if (!topicSubscriber) {
            throw new Error(`Subscriber ${subscriber.getId()} not found in topic ${topicId}`);
        }
        console.log(
            `Offset for subscriber ${subscriber.getId()} reset to ${newOffset}`
        );
        topicSubscriber.setOffset(newOffset);
    }
}