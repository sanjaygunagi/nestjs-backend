import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'nestjs_backend',
  entities: [User],
  synchronize: true, //process.env.NODE_ENV !== 'production', // Auto-sync schema in development
  logging: process.env.NODE_ENV !== 'production',
  ssl: false, //process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};
