package com.notification;

public class Notification {

    private final String subject;
    private final String message;
    private final Recipient recipient;

    public Notification(NotificationBuilder notificationBuilder) {
        this.subject = notificationBuilder.subject;
        this.message = notificationBuilder.message;
        this.recipient = notificationBuilder.recipient;
    }

    public Recipient getRecipient(){
        return this.recipient;
    }

    public String getMessage(){
        return this.message;
    }

    public String getSubject() {
        return this.subject;
    }

    public static class NotificationBuilder {

        private final Recipient recipient;
        private final NotificationType notificationType;
        private String subject;
        private String message;

        public NotificationBuilder(Recipient recipient, NotificationType notificationType) {
            this.recipient = recipient;
            this.notificationType = notificationType;
        }

        public NotificationBuilder setSubject(String subject) {
            this.subject = subject;
            return this;
        }

        public NotificationBuilder setMessage(String message) {
            this.message = message;
            return this;
        }

        public Notification build(){
            return new Notification(this);
        }
    }
}
