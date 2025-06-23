import { Topic } from "./topic";

export class PubSub {

    createTopic(topicName: string): Topic {
        return new Topic(topicName)
    }
}