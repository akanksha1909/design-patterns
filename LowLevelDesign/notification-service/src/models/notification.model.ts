import type { ChannelType } from "../enums/channel-type.enum.js";
import { NotificationBuilder } from "./notification-builder.model.js";
import { v4 as uuid } from 'uuid';

export class Notification {
    private id: string;
    private subject: string;
    private message: string;
    private to: string;
    private channel: ChannelType;

    constructor(builder: NotificationBuilder) {
        this.id = uuid();
        this.to = builder.to;
        this.subject = builder.subject;
        this.message = builder.message;
        this.channel = builder.channel;
    }

    getId(): string {
        return this.id;
    }

    getTo(): string {
        return this.to;
    }

    getSubject(): string {
        return this.subject;
    }

    getMessage(): string {
        return this.message;
    }

    getChannel(): ChannelType {
        return this.channel;
    }
}
