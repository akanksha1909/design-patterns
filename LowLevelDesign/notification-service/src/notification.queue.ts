import type { Notification } from "./models/notification.model.js";

class NotificationQueue {
    private queue: Notification[] = [];

    enqueue(notification: Notification) {
        console.log("Enqueued Successfully")
        this.queue.push(notification);
    }

    dequeue(): Notification | undefined {
        console.log("Dequeued Successfully")
        return this.queue.shift();
    }
}

export const notificationQueue = new NotificationQueue();