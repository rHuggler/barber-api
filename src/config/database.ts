import { ConnectionOptions as MongoOptions } from 'mongoose';
import { ConnectionOptions as PostgresOptions } from 'typeorm';

export const postgresConfig: PostgresOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'barber',
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

export const mongoConfig: MongoOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
