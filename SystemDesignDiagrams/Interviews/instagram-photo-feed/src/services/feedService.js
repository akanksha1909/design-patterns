const redis = require('../cache/redisClient');
const config = require('../config');
const postRepository = require('../repositories/postRepository');
const followRepository = require('../repositories/followRepository');

const FEED_CACHE_KEY = (userId) => `user:feed:${userId}`;

function buildCursorFromScore(score) {
  if (!score) {
    return null;
  }
  return `${score}`;
}

function parseCursor(cursor) {
  if (!cursor) {
    return null;
  }

  const value = Number(cursor);
  return Number.isNaN(value) ? null : value;
}

async function fetchIdsFromRedis(userId, limit, cursorScore) {
  const key = FEED_CACHE_KEY(userId);
  if (cursorScore) {
    return redis.zrevrangebyscore(key, `(${cursorScore}`, '-inf', 'LIMIT', 0, limit);
  }

  return redis.zrevrange(key, 0, limit - 1);
}

async function warmFeedCache(userId, posts) {
  if (!posts || posts.length === 0) {
    return;
  }

  const key = FEED_CACHE_KEY(userId);
  const commands = [];
  for (const post of posts) {
    const score = new Date(post.created_at).getTime();
    commands.push(['zadd', key, score, post.id.toString()]);
  }

  await redis.multi(commands).exec();
  await redis.expire(key, config.feedCacheTtlSeconds);
  await redis.zremrangebyrank(key, 0, -config.feedCacheMaxPosts - 1);
}

async function loadFeed(userId, limit, cursor) {
  const cursorScore = parseCursor(cursor);
  const cachedIds = await fetchIdsFromRedis(userId, limit, cursorScore);

  if (cachedIds && cachedIds.length === limit) {
    const posts = await postRepository.fetchPostsByIds(cachedIds);
    const nextCursor = buildCursorFromScore(
      posts.length > 0 ? new Date(posts[posts.length - 1].created_at).getTime() : null
    );
    return { posts, nextCursor };
  }

  const followedUserIds = await followRepository.getFollowedUserIds(userId);
  const authorIds = [userId, ...new Set(followedUserIds)].slice(0, 200);
  const posts = await postRepository.fetchRecentPostsForUserIds(authorIds, limit);
  await warmFeedCache(userId, posts);

  const nextCursor = buildCursorFromScore(
    posts.length > 0 ? new Date(posts[posts.length - 1].created_at).getTime() : null
  );

  return {
    posts,
    nextCursor,
  };
}

async function getFeed(userId, limit = config.defaultFeedLimit, cursor = null) {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('userId must be a positive integer');
  }

  const boundedLimit = Math.min(Math.max(limit, 1), config.defaultFeedLimit);
  return loadFeed(userId, boundedLimit, cursor);
}

module.exports = {
  getFeed,
};
