import { DataSource } from 'typeorm';
import { Link } from './src/links/links.entity';
import { Stat } from './src/stats/stat.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
  entities: [Link, Stat],
  migrations: [__dirname + '/src/migrations/**/*{.ts,.js}'],
  synchronize: false,
});
