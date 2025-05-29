const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.PG_URL
});

// Generic query wrapper
async function query(text, params) {
  return pool.query(text, params);
}

// Retrieve original URL using short code
async function getUrl(shortCode) {
  const q = 'SELECT long_url FROM urls WHERE short_code = $1';
  const result = await query(q, [shortCode]);
  return result.rows[0]?.long_url || null;
}

module.exports = {
  getUrl
};
