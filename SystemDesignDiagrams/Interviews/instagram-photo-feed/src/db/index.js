const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  connectionString: config.dbUrl,
  max: parseInt(process.env.PGPOOL_MAX, 10) || 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (error) => {
  // The pool will try to recover from network errors automatically.
  // Log only so the process remains observable.
  // eslint-disable-next-line no-console
  console.error('Postgres idle client error', error);
});

module.exports = pool;
