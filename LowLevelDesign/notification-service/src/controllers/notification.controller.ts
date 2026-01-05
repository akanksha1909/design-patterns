import type { Request, Response } from "express";
import { NotificationBuilder } from "../models/notification-builder.model.js";
import { notificationService } from "../services/notification.service.js";

class NotificationController {
    send(req: Request, res: Response) {
        const { to, channel, subject, message } = req.body;
        if (!to || !channel || !subject || !message) {
            return res.status(400).json({ error: 'Invalid Request' });
        }

        const notification = new NotificationBuilder().setMessage(message)
            .setSubject(subject).setChannel(channel).setTo(to).build();

        notificationService.send(notification);
        return res.status(202).json({
            status: 'ACCEPTED',
            notificationId: notification.getId()
        });
    }
}

export const notificationController = new NotificationController();