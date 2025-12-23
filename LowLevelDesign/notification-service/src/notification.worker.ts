import type { Notification } from "./models/notification.model.js";
import { notificationQueue } from "./notification.queue.js";
import { SenderFactory } from "./sender.factory.js";

export class NotificationWorker {
    static async process() {
        setInterval(async () => {
            const notification = notificationQueue.dequeue();
            if (!notification) {
                console.log('Notification not found')
                return;
            }

            try {
                const sender = SenderFactory.getSender(notification.getChannel());
                await sender.send(notification);
                console.log(`Notification ${notification.getId()} sent`);
            } catch (error) {

            }
        }, 5000);
    }
}