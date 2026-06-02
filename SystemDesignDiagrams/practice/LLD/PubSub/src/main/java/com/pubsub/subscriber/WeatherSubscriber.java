package com.pubsub.subscriber;

import com.pubsub.entities.Message;
import com.pubsub.entities.Topic;

public class WeatherSubscriber implements Subscriber {
    public void onUpdate(Topic topic, Message message) {
        System.out.println("[WeatherSubscriber] Consuming from topic " + topic.getName() + " Message Received " + message.getText());
    }
}
