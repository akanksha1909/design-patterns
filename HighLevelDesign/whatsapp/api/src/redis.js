import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
console.log(`Connecting to Redis at ${redisUrl}`);

const publisher = createClient({
  url: redisUrl,
});

const subscriber = publisher.duplicate();
publisher.on('error', (err) => console.error('Redis Publisher Error', err));
subscriber.on('error', (err) => console.error('Redis Subscriber Error', err));

(async () => {
  try {
    await publisher.connect();
    await subscriber.connect();
    console.log('Redis clients connected successfully.');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    // In a real application, you might want to exit the process
    // if a critical connection like Redis fails.
    // process.exit(1); 
  }
})();

export { publisher, subscriber };
