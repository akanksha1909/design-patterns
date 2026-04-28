import { Message } from "../entities/Message";

export interface Subscriber {
    onMessage(message: Message): void;
    getId(): string;
}