import { DataSource, DataSourceOptions } from 'typeorm';
import { loadConfiguration } from '../config/configuration';

const config = loadConfiguration();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: config.server.nodeEnv === 'development',
};

export const AppDataSource = new DataSource(typeOrmConfig);
