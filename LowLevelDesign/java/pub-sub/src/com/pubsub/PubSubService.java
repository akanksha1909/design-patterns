package com.pubsub;

import com.pubsub.entities.Message;
import com.pubsub.entities.Topic;
import com.pubsub.subscriber.Subscriber;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class PubSubService {
    private static PubSubService instance;
    private Map<String, Topic> topics;
    private final ExecutorService deliveryExecutor;


    private PubSubService() {
        this.topics = new ConcurrentHashMap<>();
        // A cached thread pool is suitable for handling many short-lived, bursty tasks (message deliveries).
        deliveryExecutor = Executors.newCachedThreadPool();
    }

    public static PubSubService getInstance() {
        if(instance == null) {
            instance = new PubSubService();
        }
        return instance;
    }

    public void createTopic(String topicName) {
        Topic topic = new Topic(topicName, deliveryExecutor);
        this.topics.put(topicName, topic);
    }

    public void subscribeToTopic(String topicName, Subscriber subscriber) {
        Topic topic = this.topics.get(topicName);
        topic.addSubscriber(subscriber);
    }

    public void unsubscribeToTopic(String topicName, Subscriber subscriber) {
        Topic topic = this.topics.get(topicName);
        topic.removeSubscriber(subscriber);
    }

    public void publish(String topicName, Message message) {
        Topic topic = this.topics.get(topicName);
        topic.broadCast(message);
    }

    public void shutdown() {
        System.out.println("PubSub service shutting down...");
        deliveryExecutor.shutdown();

        try {
            // Wait a reasonable time for existing tasks to complete
            if (!deliveryExecutor.awaitTermination(60, TimeUnit.SECONDS)) {
                deliveryExecutor.shutdownNow();
            }
        } catch(InterruptedException e) {
            deliveryExecutor.shutdown();
            Thread.currentThread().interrupt();
        }
        System.out.println("PubSubService shutdown complete.");
    }
}
