const db = require('../db');

async function getFollowedUserIds(userId) {
  const query = `
    SELECT followed_user_id
    FROM follows
    WHERE user_id = $1
  `;

  const { rows } = await db.query(query, [userId]);
  return rows.map((row) => row.followed_user_id);
}

module.exports = {
  getFollowedUserIds,
};
