const KAFKA_BROKER_URL = 'localhost:9092';
const KAFKA_TOPIC = 'sensor_data';
const KAFKA_PARTITIONS = 3; // Important for demonstrating consumer groups
const KAFKA_REPLICATION_FACTOR = 1; // For local setup

module.exports = {
    KAFKA_BROKER_URL,
    KAFKA_TOPIC,
    KAFKA_PARTITIONS,
    KAFKA_REPLICATION_FACTOR
};