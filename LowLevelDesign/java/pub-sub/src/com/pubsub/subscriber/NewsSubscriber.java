package com.pubsub.subscriber;

import com.pubsub.entities.Message;

public class NewsSubscriber implements Subscriber {
    private String id;
    public NewsSubscriber(String id) {
        this.id = id;
    }

    public String getId() {
        return this.id;
    }

    public void onUpdate(Message message) {
        System.out.printf("[Subscriber %s] received message '%s'%n", id, message.getContent());
    }
}
