package com.pubsub;

import com.pubsub.entities.Message;
import com.pubsub.entities.Topic;
import com.pubsub.subscriber.AlertSubscriber;
import com.pubsub.subscriber.NewsSubscriber;
import com.pubsub.subscriber.Subscriber;

public class Demo {
    public static void main(String args[]) throws InterruptedException {
        PubSubService service = PubSubService.getInstance();

        service.createTopic("SPORTS");
        service.createTopic("WEATHER");

        Subscriber sportsFan1 = new NewsSubscriber("News");
        Subscriber sportsFan2 = new NewsSubscriber("News");
        Subscriber weatherAdmin = new NewsSubscriber("Weather");

        Subscriber admin = new AlertSubscriber("SystemAdmin");

        service.subscribeToTopic("SPORTS", sportsFan1);
        service.subscribeToTopic("SPORTS", sportsFan2);

        service.subscribeToTopic("WEATHER", weatherAdmin);

        service.publish("SPORTS", new Message("Team A wins the championship!"));
        service.publish("WEATHER", new Message("Sunny with a high of 75°F."));

        // Allow some time for async messages to be processed
        Thread.sleep(500);

        // SportsFan2 gets tired of sports news
        service.unsubscribeToTopic("SPORTS", sportsFan2);

        // Publish another message to SPORTS
        service.publish("SPORTS", new Message("Major player traded to Team B."));
        Thread.sleep(500);
        service.shutdown();
    }
}
