import { DataSource, DataSourceOptions } from 'typeorm';
import { NguoiDungEntity } from '../database/entities/nguoi-dung.entity';
import { NguoiDungThietBiEntity } from '../database/entities/nguoi-dung-thiet-bi.entity';
import { BaiGiangEntity } from '../database/entities/bai-giang.entity';
import { TuVungEntity } from '../database/entities/tu-vung.entity';
import { TroChoiEntity } from '../database/entities/tro-choi.entity';
import { BaiTapEntity } from '../database/entities/bai-tap.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres_secure_2026',
  database: process.env.DB_NAME ?? 'eng_lesson_db',
  synchronize: false,
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
