const db = require('../db');

async function fetchPostsByIds(postIds) {
  if (!Array.isArray(postIds) || postIds.length === 0) {
    return [];
  }

  const query = `
    SELECT
      p.id,
      p.user_id,
      p.image_url,
      p.caption,
      p.metadata,
      p.created_at,
      u.username,
      u.display_name
    FROM posts p
    INNER JOIN users u ON u.id = p.user_id
    WHERE p.id = ANY($1)
      AND p.is_active = true
    ORDER BY p.created_at DESC, p.id DESC
  `;

  const { rows } = await db.query(query, [postIds]);
  const postsById = new Map(rows.map((post) => [post.id.toString(), post]));
  return postIds
    .map((id) => postsById.get(id.toString()))
    .filter(Boolean);
}

async function fetchRecentPostsForUserIds(userIds, limit) {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return [];
  }

  const query = `
    SELECT
      p.id,
      p.user_id,
      p.image_url,
      p.caption,
      p.metadata,
      p.created_at,
      u.username,
      u.display_name
    FROM posts p
    INNER JOIN users u ON u.id = p.user_id
    WHERE p.user_id = ANY($1)
      AND p.is_active = true
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT $2
  `;

  const { rows } = await db.query(query, [userIds, limit]);
  return rows;
}

module.exports = {
  fetchPostsByIds,
  fetchRecentPostsForUserIds,
};
