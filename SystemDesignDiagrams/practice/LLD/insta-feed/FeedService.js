'use strict';

/**
 * Instagram-style feed using Fanout-on-Write (push model).
 *
 * Trade-off:
 *   Write: O(n) where n = number of followers  — post fans out immediately
 *   Read:  O(1)                                — feed is pre-computed
 *
 * In-memory stores:
 *   users     Map<userId, User>
 *   posts     Map<postId, Post>
 *   followers Map<userId, Set<followerId>>   — who follows this user
 *   following Map<userId, Set<followeeId>>   — who this user follows
 *   feeds     Map<userId, Post[]>            — pre-computed, newest-first
 *   userPosts Map<userId, Post[]>            — per-user post history, newest-first
 */
class FeedService {
  constructor({ feedLimit = 1000, backfillLimit = 20 } = {}) {
    this.FEED_LIMIT = feedLimit;
    this.BACKFILL_LIMIT = backfillLimit;

    this._uidSeq = 1;
    this._pidSeq = 1;

    this.users     = new Map();
    this.posts     = new Map();
    this.followers = new Map();
    this.following = new Map();
    this.feeds     = new Map();
    this.userPosts = new Map();
  }

  // ─── User management ───────────────────────────────────────────────────────

  createUser(username) {
    if (!username || typeof username !== 'string') throw new Error('username required');
    const id   = String(this._uidSeq++);
    const user = { id, username, createdAt: Date.now() };
    this.users    .set(id, user);
    this.followers.set(id, new Set());
    this.following.set(id, new Set());
    this.feeds    .set(id, []);
    this.userPosts.set(id, []);
    return user;
  }

  getUser(userId) {
    return this._assertUser(userId);
  }

  // ─── Social graph ──────────────────────────────────────────────────────────

  follow(followerId, followeeId) {
    this._assertUser(followerId);
    this._assertUser(followeeId);
    if (followerId === followeeId) throw new Error('Cannot follow yourself');
    if (this.following.get(followerId).has(followeeId)) return; // already following

    this.following.get(followerId).add(followeeId);
    this.followers.get(followeeId).add(followerId);

    // Backfill the follower's feed with the followee's recent posts
    const recentPosts = this.userPosts.get(followeeId).slice(0, this.BACKFILL_LIMIT);
    for (const post of recentPosts) {
      this._insertIntoFeed(followerId, post);
    }
  }

  unfollow(followerId, followeeId) {
    this._assertUser(followerId);
    this._assertUser(followeeId);
    if (!this.following.get(followerId).has(followeeId)) return; // not following

    this.following.get(followerId).delete(followeeId);
    this.followers.get(followeeId).delete(followerId);

    // Purge unfollowed user's posts from the follower's feed
    const feed = this.feeds.get(followerId);
    this.feeds.set(followerId, feed.filter(p => p.userId !== followeeId));
  }

  getFollowers(userId) {
    this._assertUser(userId);
    return [...this.followers.get(userId)].map(id => this.users.get(id));
  }

  getFollowing(userId) {
    this._assertUser(userId);
    return [...this.following.get(userId)].map(id => this.users.get(id));
  }

  // ─── Posts ─────────────────────────────────────────────────────────────────

  createPost(userId, content) {
    this._assertUser(userId);
    if (!content || typeof content !== 'string') throw new Error('content required');

    const id   = String(this._pidSeq++);
    const post = { id, userId, content, createdAt: Date.now() };

    this.posts.set(id, post);
    this.userPosts.get(userId).unshift(post);

    // Fanout: push to all followers' feeds AND the author's own feed
    const targets = [userId, ...this.followers.get(userId)];
    for (const targetId of targets) {
      this._insertIntoFeed(targetId, post);
    }

    return post;
  }

  deletePost(postId) {
    const post = this.posts.get(postId);
    if (!post) throw new Error(`Post ${postId} not found`);

    this.posts.delete(postId);

    // Remove from author's post history
    const authored = this.userPosts.get(post.userId);
    this.userPosts.set(post.userId, authored.filter(p => p.id !== postId));

    // Fanout-delete: remove from author's feed and all followers' feeds
    const targets = [post.userId, ...this.followers.get(post.userId)];
    for (const targetId of targets) {
      const feed = this.feeds.get(targetId);
      this.feeds.set(targetId, feed.filter(p => p.id !== postId));
    }

    return post;
  }

  // ─── Feed retrieval ────────────────────────────────────────────────────────

  /**
   * Returns a paginated slice of the pre-computed feed for userId.
   * Reading is O(1) — just an array slice.
   */
  getFeed(userId, { page = 1, limit = 20 } = {}) {
    this._assertUser(userId);
    const feed  = this.feeds.get(userId);
    const start = (page - 1) * limit;
    const items = feed.slice(start, start + limit).map(post => ({
      ...post,
      author: this.users.get(post.userId).username,
    }));
    return {
      items,
      page,
      limit,
      total:   feed.length,
      hasMore: start + limit < feed.length,
    };
  }

  // ─── Stats ─────────────────────────────────────────────────────────────────

  getStats() {
    const result = {};
    for (const [userId, user] of this.users) {
      result[user.username] = {
        feedSize:  this.feeds.get(userId).length,
        posts:     this.userPosts.get(userId).length,
        followers: this.followers.get(userId).size,
        following: this.following.get(userId).size,
      };
    }
    return result;
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  /**
   * Insert post into a feed, maintaining newest-first order.
   * Uses binary search for efficiency when called during backfill.
   */
  _insertIntoFeed(userId, post) {
    const feed = this.feeds.get(userId);

    // New live posts are almost always the newest — fast path
    if (feed.length === 0 || post.createdAt >= feed[0].createdAt) {
      feed.unshift(post);
    } else {
      // Binary search for the right insertion point (descending order)
      let lo = 0, hi = feed.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (feed[mid].createdAt > post.createdAt) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }
      feed.splice(lo, 0, post);
    }

    // Enforce feed size cap
    if (feed.length > this.FEED_LIMIT) {
      feed.length = this.FEED_LIMIT;
    }
  }

  _assertUser(userId) {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User "${userId}" not found`);
    return user;
  }
}

module.exports = FeedService;
