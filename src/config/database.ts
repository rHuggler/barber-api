import { ConnectionOptions as MongoOptions } from 'mongoose';
import { ConnectionOptions as PostgresOptions } from 'typeorm';

const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
const POSTGRES_PORT = process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432;
const POSTGRES_USERNAME = process.env.POSTGRES_USERNAME || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || 'barber';

export const postgresConfig: PostgresOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
  synchronize: true,
  logging: false,
  entities: [
    'src/app/entities/models/**/*.ts',
  ],
  migrations: [
    'src/database/migrations/**/*.ts',
  ],
  subscribers: [
    'src/database/subscribers/**/*.ts',
  ],
  cli: {
    entitiesDir: 'src/app/entities/models',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'src/database/subscribers',
  },
};

interface IMongoConfig {
  uri: string;
  options: MongoOptions;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/barber';

export const mongoConfig: IMongoConfig = {
  uri: MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
};
