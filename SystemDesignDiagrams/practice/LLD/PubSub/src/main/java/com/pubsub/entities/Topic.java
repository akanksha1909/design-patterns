package com.pubsub.entities;

import com.pubsub.subscriber.Subscriber;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Topic {
    private final String name;
    private Set<Subscriber> subscribers = new HashSet<>();
    private final ExecutorService deliveryExecutor;

    public Topic(String topicName, ExecutorService deliveryExecutor) {
        this.name = topicName;
        this.deliveryExecutor = deliveryExecutor;
    }

    public String getName() {
        return name;
    }

    public void addSubscriber(Subscriber subscriber) {
        subscribers.add(subscriber);
    }

    public void removeSubscriber(Subscriber subscriber) {
        subscribers.remove(subscriber);
    }

    public void notify(Message message) {
        for(Subscriber subscriber: subscribers) {
            deliveryExecutor.submit(() -> {
                try {
                    subscriber.onUpdate(this, message);
                } catch(Exception e) {
                    System.err.println("Error while delivering message to subscriber " + e.getMessage());
                }
            });
        }
    }
}
