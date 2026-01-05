import type { Notification } from "../models/notification.model.js";

export interface NotificationSender {
    send(notification: Notification): Promise<void>
} 