// Subscriber Interface

export interface ISubscriber {
    onMessage(topicName: string, message: string): void
}