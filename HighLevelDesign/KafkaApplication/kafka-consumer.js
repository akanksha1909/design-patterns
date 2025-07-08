const { Kafka } = require('kafkajs');
const { KAFKA_BROKER_URL, KAFKA_TOPIC } = require('./config');


async function consumeSensorData(consumerGroupId, consumerName) {
    const kafka = new Kafka({
        clientId: `${consumerGroupId}-${consumerName}-client`,
        brokers: [KAFKA_BROKER_URL],
        retry: {
            initialRetryTime: 100,
            retries: 8
        }
    });

    const consumer = kafka.consumer({ groupId: consumerGroupId });
    console.log(`[${consumerName}] Attempting to connect KafkaConsumer to ${KAFKA_BROKER_URL} in group '${consumerGroupId}'...`);

    try {
        await consumer.connect();
        console.log(`[${consumerName}] KafkaConsumer connected successfully to group '${consumerGroupId}'.`);

        await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });
        console.log(`[${consumerName}] Subscribed to topic '${KAFKA_TOPIC}'. Waiting for messages. Press Ctrl+C to stop.`);

        consumer.on(consumer.events.GROUP_JOIN, ({ payload }) => {
            console.log(`[${consumerName}] Group joined: ${payload.groupId}, Leader: ${payload.leaderId}`);
            console.log(`[${consumerName}] Member assignments:`, JSON.stringify(payload.memberAssignment, null, 2));
        });

        consumer.on(consumer.events.CRASH, ({ payload: { error } }) => {
            console.error(`[${consumerName}] Consumer crashed:`, error);
        });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value.toString();
                const key = message.key ? message.key.toString() : 'N/A';
                console.log(`[${consumerName}] Received: ` +
                    `Topic=${topic}, ` +
                    `Partition=${partition}, ` +
                    `Offset=${message.offset}, ` +
                    `Key=${key}, ` +
                    `Value=${value}`);
            }
        });
    } catch (error) {
        console.error(`[${consumerName}] Failed to connect KafkaConsumer:`, error);
        process.exit(1); // Exit if consumer can't connect
    }
}

const consumerGroupId = process.argv[2];
const consumerName = process.argv[3];

if (!consumerGroupId || !consumerName) {
    console.log("Usage: node kafka_consumer.js <consumer_group_id> <consumer_name>");
    console.log("Example: node kafka_consumer.js analytics_group consumer_instance_1");
    process.exit(1);
}

consumeSensorData(consumerGroupId, consumerName);
