package com.pubsub;

import com.pubsub.entities.Message;
import com.pubsub.entities.Topic;
import com.pubsub.subscriber.Subscriber;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class PubSubService {
    private static PubSubService instance;
    private Map<String, Topic> topics;

    private PubSubService() {
        this.topics = new ConcurrentHashMap<>();
    }

    public static PubSubService getInstance() {
        if(instance == null) {
            instance = new PubSubService();
        }
        return instance;
    }

    public void createTopic(String topicName) {
        Topic topic = new Topic(topicName);
        this.topics.put(topicName, topic);
    }

    public void subscribeToTopic(String topicName, Subscriber subscriber) {
        Topic topic = this.topics.get(topicName);
        topic.addSubscriber(subscriber);
    }

    public void publish(String topicName, Message message) {
        Topic topic = this.topics.get(topicName);
        topic.broadCast(message);
    }
}
