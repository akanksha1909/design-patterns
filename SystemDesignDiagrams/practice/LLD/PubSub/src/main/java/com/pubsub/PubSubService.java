package com.pubsub;

import com.pubsub.entities.Message;
import com.pubsub.entities.Topic;
import com.pubsub.subscriber.Subscriber;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class PubSubService {
    private static PubSubService instance;
    private final Map<String, Topic> topics = new ConcurrentHashMap<>();
    private final ExecutorService deliveryExecutor = Executors.newFixedThreadPool(3);

    public static PubSubService getInstance() {
        if(PubSubService.instance == null) {
            PubSubService.instance = new PubSubService();
        }
        return PubSubService.instance;
    }

    public Topic createTopic(String topicName) {
        Topic topic = new Topic(topicName, deliveryExecutor);
        topics.put(topic.getName(), topic);
        return topic;
    }

    public void subscribeToTopic(Subscriber subscriber, String topicName) {
        Topic topic = topics.get(topicName);
        topic.addSubscriber(subscriber);
    }

    public void publish(Topic topic, Message message) {
        topic.notify(message);
    }

    public void shutdown() {
        System.out.println("PubSubService shutting down...");
        deliveryExecutor.shutdown();

        try {
            if(!deliveryExecutor.awaitTermination(60, TimeUnit.SECONDS)) {
                deliveryExecutor.shutdownNow();
            }
        } catch(Exception e) {
            deliveryExecutor.shutdownNow();
            Thread.currentThread().interrupt();
        }
        System.out.println("PubSubService shutdown complete.");
    }
}
