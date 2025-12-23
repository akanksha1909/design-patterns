import type { ChannelType } from "../enums/channel-type.enum.js";
import { Notification } from "./notification.model.js";

export class NotificationBuilder {

    public subject!: string;
    public message!: string;
    public to!: string;
    public channel!: ChannelType;

    setTo(to: string): this {
        this.to = to;
        return this;
    }

    setSubject(subject: string): this {
        this.subject = subject;
        return this;
    }

    setMessage(message: string): this {
        this.message = message;
        return this;
    }

    setChannel(channel: ChannelType): this {
        this.channel = channel;
        return this;
    }

    build(): Notification {
        return new Notification(this);
    }
}