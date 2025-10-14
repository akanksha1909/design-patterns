package com.pubsub.subscriber;

import com.pubsub.entities.Message;

public class AlertSubscriber implements Subscriber {
    private String id;
    public AlertSubscriber(String id) {
        this.id = id;
    }

    public String getId() {
        return this.id;
    }

    public void onUpdate(Message message) {
        System.out.printf("!!! [ALERT - %s] : '%s' !!!%n", id, message.getContent());
    }
}
