import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
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

export default config;
