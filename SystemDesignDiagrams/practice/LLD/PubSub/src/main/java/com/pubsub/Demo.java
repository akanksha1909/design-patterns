package com.pubsub;

import com.pubsub.entities.Message;
import com.pubsub.entities.Topic;
import com.pubsub.subscriber.NewsSubscriber;
import com.pubsub.subscriber.SportsSubscriber;
import com.pubsub.subscriber.Subscriber;
import com.pubsub.subscriber.WeatherSubscriber;

public class Demo {
    public static void main(String args[]) throws InterruptedException {
        PubSubService pubSubService = PubSubService.getInstance();

        Topic sportsTopic = pubSubService.createTopic("Sports");
        Topic weatherTopic = pubSubService.createTopic("Weather");

        Subscriber sportsSubscriber = new SportsSubscriber();
        Subscriber weatherSubscriber = new WeatherSubscriber();
        Subscriber newsSubscriber = new NewsSubscriber();

        pubSubService.subscribeToTopic(sportsSubscriber, sportsTopic.getName());
        pubSubService.subscribeToTopic(weatherSubscriber, weatherTopic.getName());
        pubSubService.subscribeToTopic(newsSubscriber, sportsTopic.getName());
        pubSubService.subscribeToTopic(newsSubscriber, weatherTopic.getName());

        pubSubService.publish(sportsTopic, new Message("Cricket Women team has won the match!"));
        pubSubService.publish(weatherTopic, new Message("SnowFall in Uttar Pradesh"));

        // Give messages time to be delivered
        Thread.sleep(500);

        pubSubService.shutdown();
    }
}
