import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';

dotenvConfig();

export const typeOrmConfig: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'cloud_academy',
  entities: [join(__dirname, '/../**/*.entity.{js,ts}')],
  migrations: [join(__dirname, '/../migrations/*.{js,ts}')],
  seeds: [join(__dirname, '/../database/seeds/**/*.seeder.{js,ts}')],
  factories: [join(__dirname, '/../database/factories/**/*.factory.{js,ts}')],
  synchronize: false,
};

const dataSource = new DataSource(typeOrmConfig);
export default dataSource;
