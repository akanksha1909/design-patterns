import type { Notification } from "../models/notification.model.js";
import type { NotificationSender } from "./notification-sender.interface.js";

export class EmailSender implements NotificationSender {
    async send(notification: Notification) {
        console.log(`📧 Sending Email to ${notification.getTo()}`);
    }
}