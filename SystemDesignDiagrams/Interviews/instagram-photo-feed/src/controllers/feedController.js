const feedService = require('../services/feedService');

async function getFeed(req, res, next) {
  try {
    const userId = Number(req.query.userId);
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const cursor = req.query.cursor || null;

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: 'userId is required and must be a positive integer' });
    }

    const result = await feedService.getFeed(userId, limit, cursor);
    return res.json({
      posts: result.posts,
      nextCursor: result.nextCursor,
      count: result.posts.length,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getFeed,
};
