package com.notification.strategy;

import com.notification.Notification;

public class EmailGateway implements NotificationGateway {
    public void send(Notification notification ) {
        String email = notification.getRecipient().getEmail();
        System.out.println("-----Sending Email------");
        System.out.println("To: " + email);
        System.out.println("Subject: " + notification.getSubject());
        System.out.println("Body: " + notification.getMessage());
        System.out.println("------------------\n");
    }
}
