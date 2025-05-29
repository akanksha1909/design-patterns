const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.PG_URL
});

// Generic query wrapper
async function query(text, params) {
  return pool.query(text, params);
}

// Insert a new shortened URL mapping
async function insertUrl(id, shortCode, longUrl) {
  const q = 'INSERT INTO urls(id, short_code, long_url) VALUES ($1, $2, $3)';
  await query(q, [id, shortCode, longUrl]);
}

module.exports = {
  insertUrl
};
