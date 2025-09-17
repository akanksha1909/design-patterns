package com.notification;

public class NotificationSystemDemo {
    public static void main(String args[]) {
        NotificationService service = new NotificationService(3);
        Recipient alice = service.createRecipient("alice", "alice@gmail.com");
        Recipient bob = service.createRecipient("bob", "bob@gmail.com");

        Notification notification = service.createNotification(alice, NotificationType.EMAIL, "Welcome!", "Welcome to notification System!");
        service.sendNotification(notification);
        service.shutdown();
    }
}
