package com.pubsub.subscriber;

import com.pubsub.entities.Message;
import com.pubsub.entities.Topic;

public interface Subscriber {
    public void onUpdate(Topic topic, Message message);
}
