import type { Notification } from "../models/notification.model.js";
import { notificationQueue } from "../notification.queue.js";

class NotificationService {
    send(notification: Notification) {
        notificationQueue.enqueue(notification);
    }
}

export const notificationService = new NotificationService();