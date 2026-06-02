const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const parseIntOr = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

module.exports = {
  port: parseIntOr(process.env.PORT, 4000),
  dbUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/instagram_feed',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  feedCacheTtlSeconds: parseIntOr(process.env.FEED_CACHE_TTL_SECONDS, 300),
  feedCacheMaxPosts: parseIntOr(process.env.FEED_CACHE_MAX_POSTS, 200),
  defaultFeedLimit: parseIntOr(process.env.FEED_LIMIT, 50),
};
