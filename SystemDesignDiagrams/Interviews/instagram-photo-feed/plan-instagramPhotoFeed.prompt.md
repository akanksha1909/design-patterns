## Plan: Instagram Feed Backend APIs

TL;DR: Build a Node.js backend API that returns 50 Instagram-style posts in 300ms by using PostgreSQL as the persistent store and Redis for feed caching. The main read path should be Redis lookup for post IDs followed by a single batched DB query.

### Steps

1. Architecture
   - Node.js with TypeScript and Express or Fastify
   - PostgreSQL for `posts`, `users`, and `follows`
   - Redis for `user:feed:{userId}` sorted-set cache

2. Data model
   - `posts`: `id`, `user_id`, `image_url`, `caption`, `created_at`, `is_active`
   - `users`: `id`, `username`, `display_name`
   - `follows`: `user_id`, `followed_user_id`, `created_at`
   - Index `posts(created_at DESC)` and `posts(user_id, created_at DESC)`

3. DB layer
   - Initialize Postgres pool
   - Repository methods:
     - fetch posts by IDs
     - fetch feed IDs for followed users
     - fetch followed user IDs if needed

4. Redis caching
   - Use sorted set per user feed: `ZADD user:feed:{userId} score postId`
   - Score = timestamp or sequence for ordering
   - Fetch top 50 IDs via `ZRANGE`/`ZREVRANGE`
   - Optional hot-post hash cache for popular post payloads

5. Feed service
   - `getFeed(userId, limit, cursor)`
   - Try Redis for post IDs first
   - If cache hit: batch query DB with `WHERE id IN (...)`
   - If cache miss/partial: compute from DB and warm Redis
   - Return posts plus `nextCursor` for pagination

6. API route
   - GET `/api/feed?userId=...&limit=50`
   - Validate input and call feed service
   - Return JSON: `posts`, `nextCursor`, `count`

7. Production hardening
   - Use env config for DB/Redis URLs and pool sizes
   - Cache invalidation after new post or follow update
   - Use connection pools and async error handling
   - Log cache hit/miss and request latency

### Relevant files

- `src/app.ts` / `src/server.ts`
- `src/routes/feed.ts`
- `src/controllers/feedController.ts`
- `src/services/feedService.ts`
- `src/repositories/postRepository.ts`
- `src/cache/redisClient.ts`
- `src/db/index.ts`
- `src/migrations/create_posts_table.sql`

### Verification

1. Unit test `feedService` for Redis hit, Redis miss, and DB fallback
2. Integration test GET `/api/feed` returns 50 posts
3. Benchmark 50-post retrieval path under realistic DB/Redis latency
4. Confirm cache warm-up and invalidation on new posts/follows

### Notes

- Use PostgreSQL as the persistent database and Redis for feed ID caching.
- Optimize for read performance: cache post IDs and batch-select post data.
- Keep the API backend only, not frontend rendering.
