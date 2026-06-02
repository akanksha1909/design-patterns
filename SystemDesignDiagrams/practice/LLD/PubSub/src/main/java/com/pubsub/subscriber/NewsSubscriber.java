package com.pubsub.subscriber;

import com.pubsub.entities.Message;
import com.pubsub.entities.Topic;

public class NewsSubscriber implements Subscriber {
    public void onUpdate(Topic topic, Message message) {
        System.out.println("[NewsSubscriber] Consuming from topic " + topic.getName() + " Message Received " + message.getText());
    }
}
