const { createClient } = require('redis');

const redis = createClient({ url: 'redis://127.0.0.1:6379' });

redis.connect().catch(console.error);

const COUNTER_KEY = 'global:url_id';

async function getNextId() {
  const id = await redis.incr(COUNTER_KEY);
  return id;
}

module.exports = { getNextId };
