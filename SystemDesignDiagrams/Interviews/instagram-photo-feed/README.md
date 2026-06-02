# Instagram Photo Feed Backend

A production-style Node.js API for generating an Instagram-like photo feed with PostgreSQL persistence and Redis caching.

## Features

- Persistent `posts`, `users`, and `follows` storage in PostgreSQL
- Redis sorted-set cache for user feed index
- Efficient read path: cache IDs + batched post query
- Feed endpoint: `GET /api/feed?userId={userId}&limit=50`

## Setup

1. Copy `.env.example` to `.env` and update your database connection strings.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create database schema:
   ```bash
   npm run migrate
   ```
4. Start the service:
   ```bash
   npm start
   ```

## API

### `GET /api/feed`

Query parameters:
- `userId` (required)
- `limit` (optional, default 50)
- `cursor` (optional)

Response:
```json
{
  "posts": [...],
  "nextCursor": "...",
  "count": 50
}
```

## Notes

The feed backend is optimized for fast retrieval of 50 posts in the read path by using Redis for feed ordering and PostgreSQL for the detailed post payload.
