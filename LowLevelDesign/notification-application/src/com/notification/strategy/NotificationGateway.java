package com.notification.strategy;

import com.notification.Notification;

public interface NotificationGateway {
    void send(Notification notification);
}
