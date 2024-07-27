import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

export enum ENVIRONMENT {
  PRODUCTION = 'production',
  STAGING = 'staging',
  DEVELOPMENT = 'development',
  AUTOMATED_TEST = 'automated_tests',
}

const DATABASE_NAME_TYPE = 'mysql';

const production: DataSourceOptions = {
  type: DATABASE_NAME_TYPE,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
};

const staging: DataSourceOptions = {
  type: DATABASE_NAME_TYPE,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
};

const development: DataSourceOptions = {
  type: DATABASE_NAME_TYPE,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
};

const automatedTests: DataSourceOptions = {
  type: 'better-sqlite3',
  database: `./data/automated-test/test.${Math.random()}.db`,
  synchronize: true,
  dropSchema: false,
  verbose: console.log,
  namingStrategy: new SnakeNamingStrategy(),
};

export const dataSourceOptions: DataSourceOptions = (() => {
  switch (process.env.NODE_ENV) {
    case ENVIRONMENT.PRODUCTION:
      return production;
    case ENVIRONMENT.STAGING:
      return staging;
    case ENVIRONMENT.DEVELOPMENT:
      return development;
    case ENVIRONMENT.AUTOMATED_TEST:
      return automatedTests;
    default:
      throw new Error('Unknown environment');
  }
})();

export default new DataSource({
  ...dataSourceOptions,
  entities: ['./src/**/infrastructure/database/**/*.entity.ts'],
  migrations: ['./data/migrations/*.ts'],
});
