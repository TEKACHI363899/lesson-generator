"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
const nguoi_dung_entity_1 = require("../database/entities/nguoi-dung.entity");
const nguoi_dung_thiet_bi_entity_1 = require("../database/entities/nguoi-dung-thiet-bi.entity");
const bai_giang_entity_1 = require("../database/entities/bai-giang.entity");
const tu_vung_entity_1 = require("../database/entities/tu-vung.entity");
const tro_choi_entity_1 = require("../database/entities/tro-choi.entity");
const bai_tap_entity_1 = require("../database/entities/bai-tap.entity");
exports.dataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres_secure_2026',
    database: process.env.DB_NAME ?? 'eng_lesson_db',
    synchronize: false,
    entities: [
        nguoi_dung_entity_1.NguoiDungEntity,
        nguoi_dung_thiet_bi_entity_1.NguoiDungThietBiEntity,
        bai_giang_entity_1.BaiGiangEntity,
        tu_vung_entity_1.TuVungEntity,
        tro_choi_entity_1.TroChoiEntity,
        bai_tap_entity_1.BaiTapEntity,
    ],
    migrations: ['dist/database/migrations/*.js'],
    logging: process.env.NODE_ENV !== 'production',
};
exports.AppDataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
//# sourceMappingURL=data-source.js.map