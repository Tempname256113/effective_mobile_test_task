import { registerAs } from '@nestjs/config';

export default registerAs('pgConfig', () => ({
  connectString: process.env.DB_URL,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE_NAME,
  password: process.env.DB_PASSWORD,
}));
