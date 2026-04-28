import { PubSubManager } from "./PubSubManager";
import { SimpleSubscriber } from "./subscribers/SimpleSubscriber";
import { Message } from "./entities/Message";

class Demo {
    run() {
        const pubSubManager = PubSubManager.getInstance();
        const topic1 = pubSubManager.createTopic("Topic1");
        const topic2 = pubSubManager.createTopic("Topic2");

        const subscriber1 = new SimpleSubscriber("Subscriber1");
        const subscriber2 = new SimpleSubscriber("Subscriber2");
        const subscriber3 = new SimpleSubscriber("Subscriber3");

        pubSubManager.subscribe(topic1.getTopicId(), subscriber1);
        pubSubManager.subscribe(topic2.getTopicId(), subscriber1);
        pubSubManager.subscribe(topic1.getTopicId(), subscriber2);
        pubSubManager.subscribe(topic2.getTopicId(), subscriber3);

        pubSubManager.publish(topic1.getTopicId(), new Message("Message m1"));
        pubSubManager.publish(topic1.getTopicId(), new Message("Message m2"));
        pubSubManager.publish(topic2.getTopicId(), new Message("Message m3"));

        setTimeout(() => {
            pubSubManager.publish(topic2.getTopicId(), new Message("Message m4"));
            pubSubManager.publish(topic1.getTopicId(), new Message("Message m5"));
            pubSubManager.resetOffset(topic1.getTopicId(), subscriber1, 0);
        }, 5000);
    }
}

new Demo().run();