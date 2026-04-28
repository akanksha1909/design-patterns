import { TopicSubscriber } from "./entities/TopicSubscriber";
export class TopicSubscriberManager {
    private topicSubscriber: TopicSubscriber;
    constructor(topicSubscriber) {
        this.topicSubscriber = topicSubscriber;
    }

    async start() {
        while (this.topicSubscriber.getRunning()) {
            let messageToProcess = null;
            // synchronized starts
            const messages = this.topicSubscriber.getMessages();
            if (this.topicSubscriber.getOffset() < messages.length) {
                messageToProcess = messages[this.topicSubscriber.getOffset()];
                this.topicSubscriber.setOffset(this.topicSubscriber.getOffset() + 1);
            }
            // synchronized ends
            if (messageToProcess) {
                try {
                    await this.topicSubscriber.getSubscriber().onMessage(messageToProcess);
                } catch (error) {
                    console.log("Error processing message", error)
                }
            } else {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        }
    }
}