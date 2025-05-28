// db.js
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

// Retrieve original URL using short code
async function getUrl(shortCode) {
  const q = 'SELECT long_url FROM urls WHERE short_code = $1';
  const result = await query(q, [shortCode]);
  return result.rows[0]?.long_url || null;
}

module.exports = {
  insertUrl,
  getUrl,
};
