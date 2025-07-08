const { Kafka } = require('kafkajs');

const {
    KAFKA_BROKER_URL,
    KAFKA_TOPIC,
    KAFKA_PARTITIONS,
    KAFKA_REPLICATION_FACTOR
} = require('./config.js');

const kafka = new Kafka({
    clientId: 'kafka-admin-client',
    brokers: [KAFKA_BROKER_URL],
    retry: {
        initialRetryTime: 100,
        retries: 8 // Adjust as needed, default is often 10
    }
});

const admin = kafka.admin();

async function createKafkaTopic() {
    console.log(`Attempting to connect to Kafka broker at ${KAFKA_BROKER_URL}...`);
    try {
        await admin.connect();
        console.log("Successfully connected to Kafka admin client.");
        const topics = await admin.listTopics();
        if (topics.includes(KAFKA_TOPIC)) {
            console.log(`Topic '${KAFKA_TOPIC}' already exists. Skipping creation.`);
        } else {
            console.log(`Creating topic '${KAFKA_TOPIC}' with ${KAFKA_PARTITIONS} partitions...`);
            await admin.createTopics({
                waitForLeaders: true,
                topics: [{
                    topic: KAFKA_TOPIC,
                    numPartitions: KAFKA_PARTITIONS,
                    replicationFactor: KAFKA_REPLICATION_FACTOR,
                }],
            });
            console.log(`Topic '${KAFKA_TOPIC}' created successfully.`);
        }

    } catch (error) {
        if (error.name === 'KafkaJSError' && error.message.includes('BrokerNotAvailable')) {
            console.error(`Error: Kafka broker not available at ${KAFKA_BROKER_URL}. Please ensure Kafka is running.`);
        } else {
            console.error(`Error creating topic:`, error);
        }
    } finally {
        await admin.disconnect();
        console.log("Kafka admin client disconnected.");
    }

}

createKafkaTopic();