import knex from 'knex';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({path: join(__dirname, '../../../.env')});

export const dbConfig = {
    client: 'pg',
    connection: {
        connectString: process.env.DB_URL,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE_NAME,
        password: process.env.DB_PASSWORD,
    }
}

export const db = knex(dbConfig);