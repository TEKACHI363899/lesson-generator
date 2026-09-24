import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { NguoiDungEntity } from '../database/entities/nguoi-dung.entity';
import { NguoiDungThietBiEntity } from '../database/entities/nguoi-dung-thiet-bi.entity';
import { BaiGiangEntity } from '../database/entities/bai-giang.entity';
import { TuVungEntity } from '../database/entities/tu-vung.entity';
import { TroChoiEntity } from '../database/entities/tro-choi.entity';
import { BaiTapEntity } from '../database/entities/bai-tap.entity';

// Load environment variables from root or backend directory
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

const isSslEnabled =
  process.env.DB_SSL === 'true' ||
  Boolean(process.env.DATABASE_URL?.includes('sslmode=require')) ||
  Boolean(process.env.DATABASE_URL?.includes('supabase.com')) ||
  Boolean(process.env.DATABASE_URL?.includes('neon.tech'));

export const dataSourceOptions: DataSourceOptions = process.env.DATABASE_URL
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      ssl: isSslEnabled ? { rejectUnauthorized: false } : false,
      entities: [
        NguoiDungEntity,
        NguoiDungThietBiEntity,
        BaiGiangEntity,
        TuVungEntity,
        TroChoiEntity,
        BaiTapEntity,
      ],
      migrations: ['dist/database/migrations/*.js'],
      logging: process.env.NODE_ENV !== 'production',
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres_secure_2026',
      database: process.env.DB_NAME ?? 'eng_lesson_db',
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      ssl: isSslEnabled ? { rejectUnauthorized: false } : false,
      entities: [
        NguoiDungEntity,
        NguoiDungThietBiEntity,
        BaiGiangEntity,
        TuVungEntity,
        TroChoiEntity,
        BaiTapEntity,
      ],
      migrations: ['dist/database/migrations/*.js'],
      logging: process.env.NODE_ENV !== 'production',
    };

export const AppDataSource = new DataSource(dataSourceOptions);

