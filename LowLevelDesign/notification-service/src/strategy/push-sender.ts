import type { Notification } from "../models/notification.model.js";
import type { NotificationSender } from "./notification-sender.interface.js";

export class PushSender implements NotificationSender {
    async send(notification: Notification) {
        console.log(`📧 Sending Push to ${notification.getTo()}`);
    }
}