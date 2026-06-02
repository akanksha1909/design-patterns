const Redis = require('ioredis');
const config = require('../config');

const redis = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
  enableAutoPipelining: true,
  connectTimeout: 10000,
});

redis.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('Redis client connected');
});

redis.on('error', (error) => {
  // eslint-disable-next-line no-console
  console.error('Redis error', error);
});

module.exports = redis;
