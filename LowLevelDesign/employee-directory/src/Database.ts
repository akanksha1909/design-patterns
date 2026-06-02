import knex from 'knex';
import { Client } from 'pg';

const createDatabaseIfNotExists = async () => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'password',
    database: 'postgres' // Connect to default db to create new one
  });

  try {
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'employee_db'");
    if (res.rows.length === 0) {
      await client.query('CREATE DATABASE employee_db');
      console.log('Database employee_db created');
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
};

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'password', // Change this to your actual password
    database: 'employee_db'
  }
});

export { createDatabaseIfNotExists };
export default db;