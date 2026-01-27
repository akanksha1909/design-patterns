import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const config = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
}

const db = knex(config);
export default db;