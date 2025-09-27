package com.notification;

import com.notification.strategy.EmailGateway;
import com.notification.strategy.NotificationGateway;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class NotificationService {
    private final ExecutorService executor;
//    It creates a thread pool with a fixed number of threads (nThreads).
//    At most nThreads threads will be active at the same time.
//    If more tasks are submitted, they are queued until a thread becomes available.
//    Threads are reused to avoid the overhead of creating/destroying threads repeatedly.
    public NotificationService(int poolSize){
        this.executor = Executors.newFixedThreadPool(poolSize);
    }

    public Recipient createRecipient(String name, String email){
        return new Recipient(name, email);
    }

    public Notification createNotification(Recipient user, NotificationType notificationType, String subject, String message) {
        return new Notification.NotificationBuilder(user, NotificationType.EMAIL).setSubject(subject).setMessage(message).build();
    }

    public void sendNotification(Notification notification) {
        executor.submit(() -> {
           NotificationGateway gateway = new EmailGateway();
           gateway.send(notification);
        });
    }

    public void shutdown() {
        executor.shutdown();
    }
}
