const { createClient } = require('redis');

const redis = createClient({ url: process.env.REDIS_URL  });

redis.connect().catch(console.error);

async function getCachedUrl(shortCode) {
  return await redis.get(shortCode);
}

async function cacheUrl(shortCode, longUrl) {
  await redis.set(shortCode, longUrl, { EX: 3600 }); // 1-hour expiry
}

module.exports = { getCachedUrl, cacheUrl };
