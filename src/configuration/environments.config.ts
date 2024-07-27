import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const DATABASE_NAME_TYPE = 'mysql';

export const environmentsConfigs: {
  production: DataSourceOptions;
  staging: DataSourceOptions;
  automatedTests: DataSourceOptions;
  development: DataSourceOptions;
} = {
  production: {
    type: DATABASE_NAME_TYPE,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
  },
  staging: {
    type: DATABASE_NAME_TYPE,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
  },
  development: {
    type: DATABASE_NAME_TYPE,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
  },
  automatedTests: {
    type: 'better-sqlite3',
    database: `./data/automated-test/test.${Math.random()}.db`,
    synchronize: true,
    dropSchema: false,
    verbose: console.log,
    namingStrategy: new SnakeNamingStrategy(),
  },
};
