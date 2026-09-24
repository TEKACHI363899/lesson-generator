"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const nguoi_dung_entity_1 = require("../database/entities/nguoi-dung.entity");
const nguoi_dung_thiet_bi_entity_1 = require("../database/entities/nguoi-dung-thiet-bi.entity");
const bai_giang_entity_1 = require("../database/entities/bai-giang.entity");
const tu_vung_entity_1 = require("../database/entities/tu-vung.entity");
const tro_choi_entity_1 = require("../database/entities/tro-choi.entity");
const bai_tap_entity_1 = require("../database/entities/bai-tap.entity");
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();
const isSslEnabled = process.env.DB_SSL === 'true' ||
    Boolean(process.env.DATABASE_URL?.includes('sslmode=require')) ||
    Boolean(process.env.DATABASE_URL?.includes('supabase.com')) ||
    Boolean(process.env.DATABASE_URL?.includes('neon.tech'));
exports.dataSourceOptions = process.env.DATABASE_URL
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        ssl: isSslEnabled ? { rejectUnauthorized: false } : false,
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