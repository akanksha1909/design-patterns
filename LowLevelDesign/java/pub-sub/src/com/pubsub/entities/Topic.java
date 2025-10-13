package com.pubsub.entities;

import com.pubsub.subscriber.Subscriber;

import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.ExecutorService;

public class Topic {
    private String name;
    private Set<Subscriber> subscribers;
    private final ExecutorService deliveryExecutor;

    public Topic(String name, ExecutorService deliveryExecutor) {
        this.name = name;
        this.subscribers = new CopyOnWriteArraySet<>();
        this.deliveryExecutor = deliveryExecutor;
    }

    public void addSubscriber(Subscriber subscriber) {
        subscribers.add(subscriber);
    }

    public void removeSubscriber(Subscriber subscriber) {
        subscribers.remove(subscriber);
    }

    public void broadCast(Message message) {
        for(Subscriber subscriber: subscribers) {
            deliveryExecutor.submit(() -> {
                try {
                    subscriber.onUpdate(message);
                } catch (Exception e) {
                    System.err.println("Error while broadcasting messages to subscribers.");
                }
            });
        }
    }
}
