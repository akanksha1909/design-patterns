const { createClient } = require('redis');

console.log(process.env.REDIS_URL)

const redis = createClient({ url: process.env.REDIS_URL  });

redis.connect().catch(console.error);

const COUNTER_KEY = 'global:url_id';

async function getNextId() {
  const id = await redis.incr(COUNTER_KEY);
  console.log("**************************", id)
  return id;
}

module.exports = { getNextId };
