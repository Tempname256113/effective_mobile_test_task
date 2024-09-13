import 'dotenv/config';

export default {
  client: 'pg',
  connection: {
    connectString: process.env.DB_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE_NAME,
    password: process.env.DB_PASSWORD,
  },
};
