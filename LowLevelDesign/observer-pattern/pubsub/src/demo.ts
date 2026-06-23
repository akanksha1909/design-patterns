// Demo Class

import { PrintSubscriber } from "./print-subscriber";
import { PubSub } from "./pub-sub";
import { Publisher } from "./publisher";

const pubSub = new PubSub();

const sportsTopic = pubSub.createTopic("sports");
const newsTopic = pubSub.createTopic("news");

const alice = new PrintSubscriber('Alice');
const bob = new PrintSubscriber('Bob');

sportsTopic.addSubscriber(alice);
newsTopic.addSubscriber(bob);

const pub1 = new Publisher('ESPN')

pub1.publish(sportsTopic, 'India wins cricket match!');
pub1.publish(newsTopic, 'Stock market hits record high!');
