package com.pubsub.entities;

import com.pubsub.subscriber.Subscriber;

import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

public class Topic {
    private String name;
    private Set<Subscriber> subscribers;
    public Topic(String name) {
        this.name = name;
        this.subscribers = new CopyOnWriteArraySet<>();
    }

    public void addSubscriber(Subscriber subscriber) {
        subscribers.add(subscriber);
    }

    public void removeSubscriber(Subscriber subscriber) {
        subscribers.remove(subscriber);
    }

    public void broadCast(Message message) {
        for(Subscriber subscriber: subscribers) {
            subscriber.onUpdate(message);
        }
    }
}
