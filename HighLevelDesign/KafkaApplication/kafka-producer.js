const { Kafka } = require('kafkajs');
const { KAFKA_BROKER_URL, KAFKA_TOPIC } = require('./config.js');

const kafka = new Kafka({
    clientId: 'sensor-producer',
    brokers: [KAFKA_BROKER_URL],
    retry: {
        initialRetryTime: 100,
        retries: 8
    }
});

const producer = kafka.producer();

async function produceSensorData() {
    console.log(`Attempting to connect KafkaProducer to ${KAFKA_BROKER_URL}...`);
    try {
        await producer.connect();
        console.log("KafkaProducer connected successfully.");
        console.log(`Sending sensor data to topic: ${KAFKA_TOPIC}. Press Ctrl+C to stop.`);

        let counter = 0;
        setInterval(async () => {
            const deviceIds = ['sensor_A', 'sensor_B', 'sensor_C'];
            const device_id = deviceIds[Math.floor(Math.random() * deviceIds.length)];
            const temperature = (Math.random() * 10 + 20).toFixed(2); // 20.00 to 30.00
            const humidity = (Math.random() * 30 + 40).toFixed(2); // 40.00 to 70.00

            const data = {
                device_id: device_id,
                timestamp: Date.now(),
                temperature: parseFloat(temperature),
                humidity: parseFloat(humidity)
            };

            try {
                await producer.send({
                    topic: KAFKA_TOPIC,
                    messages: [
                        { key: device_id, value: JSON.stringify(data) },
                    ],
                });
                console.log(`Sent: ${JSON.stringify(data)} (key: ${device_id})`);
            } catch (err) {
                console.error(`Error sending message: ${err.message}`);
            }

        }, 5000);
    } catch (error) {
        console.error(`Failed to connect KafkaProducer:`, error);
        process.exit(1); // Exit if producer can't connect
    }

    process.on('SIGINT', async () => {
        console.log("\nProducer stopping...");
        try {
            await producer.disconnect();
            console.log("Producer disconnected.");
        } catch (err) {
            console.error("Error disconnecting producer:", err);
        }
        process.exit(0);
    });
}

produceSensorData();