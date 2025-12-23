import { ChannelType } from "./enums/channel-type.enum.js";
import { EmailSender } from "./strategy/email-sender.js";
import type { NotificationSender } from "./strategy/notification-sender.interface.js";
import { PushSender } from "./strategy/push-sender.js";
import { SMSSender } from "./strategy/sms-sender.js";

export class SenderFactory {
    static getSender(channel: ChannelType): NotificationSender {
        switch (channel) {
            case ChannelType.EMAIL:
                return new EmailSender();
            case ChannelType.SMS:
                return new SMSSender();
            case ChannelType.PUSH:
                return new PushSender();
            default:
                throw new Error('Unsupported Channel');
        }
    }
}