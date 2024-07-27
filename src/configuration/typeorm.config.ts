import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { environmentsConfigs as environmentsConfigs } from './environments.config';

dotenv.config();

export enum ENVIRONMENT {
  PRODUCTION = 'production',
  STAGING = 'staging',
  DEVELOPMENT = 'development',
  AUTOMATED_TEST = 'automated_tests',
}

export const dataSourceOptions: DataSourceOptions = (() => {
  switch (process.env.NODE_ENV) {
    case ENVIRONMENT.PRODUCTION:
      return environmentsConfigs.production;
    case ENVIRONMENT.STAGING:
      return environmentsConfigs.staging;
    case ENVIRONMENT.DEVELOPMENT:
      return environmentsConfigs.development;
    case ENVIRONMENT.AUTOMATED_TEST:
      return environmentsConfigs.automatedTests;
    default:
      throw new Error('Unknown environment');
  }
})();

export default new DataSource({
  ...dataSourceOptions,
  entities: [
    join(
      __dirname,
      '../modules/**/infrastructure/database/entities/*.entity.ts',
    ),
  ],
  migrations: ['./data/migrations/*.ts'],
});
