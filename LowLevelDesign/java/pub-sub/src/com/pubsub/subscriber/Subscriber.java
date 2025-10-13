package com.pubsub.subscriber;

import com.pubsub.entities.Message;

public interface Subscriber {
    void onUpdate(Message message);
}
