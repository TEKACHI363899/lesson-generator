"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaiGiangEntity = void 0;
const typeorm_1 = require("typeorm");
const nguoi_dung_entity_1 = require("./nguoi-dung.entity");
const tu_vung_entity_1 = require("./tu-vung.entity");
const tro_choi_entity_1 = require("./tro-choi.entity");
const bai_tap_entity_1 = require("./bai-tap.entity");
let BaiGiangEntity = class BaiGiangEntity {
};
exports.BaiGiangEntity = BaiGiangEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { name: 'id' }),
    __metadata("design:type", Number)
], BaiGiangEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_bai_giang_nguoi_dung_id'),
    (0, typeorm_1.Column)({ name: 'nguoi_dung_id', type: 'integer' }),
    __metadata("design:type", Number)
], BaiGiangEntity.prototype, "nguoiDungId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nguoi_dung_entity_1.NguoiDungEntity, (user) => user.baiGiangs, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'nguoi_dung_id' }),
    __metadata("design:type", nguoi_dung_entity_1.NguoiDungEntity)
], BaiGiangEntity.prototype, "nguoiDung", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_bai_giang_ma_bai_giang', { unique: true }),
    (0, typeorm_1.Column)({ name: 'ma_bai_giang', type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], BaiGiangEntity.prototype, "maBaiGiang", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tieu_de', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], BaiGiangEntity.prototype, "tieuDe", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_bai_giang_khoi_lop'),
    (0, typeorm_1.Column)({ name: 'khoi_lop', type: 'smallint' }),
    __metadata("design:type", Number)
], BaiGiangEntity.prototype, "khoiLop", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_bai_giang_chu_de'),
    (0, typeorm_1.Column)({ name: 'chu_de', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], BaiGiangEntity.prototype, "chuDe", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'thoi_luong_phut', type: 'integer', default: 45 }),
    __metadata("design:type", Number)
], BaiGiangEntity.prototype, "thoiLuongPhut", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cau_hinh_trinh_chieu', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], BaiGiangEntity.prototype, "cauHinhTrinhChieu", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_bai_giang_trang_thai'),
    (0, typeorm_1.Column)({ name: 'trang_thai', type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], BaiGiangEntity.prototype, "trangThai", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'tao_luc', type: 'timestamptz' }),
    __metadata("design:type", Date)
], BaiGiangEntity.prototype, "taoLuc", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'cap_nhat_luc', type: 'timestamptz' }),
    __metadata("design:type", Date)
], BaiGiangEntity.prototype, "capNhatLuc", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tu_vung_entity_1.TuVungEntity, (v) => v.baiGiang),
    __metadata("design:type", Array)
], BaiGiangEntity.prototype, "tuVungs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tro_choi_entity_1.TroChoiEntity, (g) => g.baiGiang),
    __metadata("design:type", Array)
], BaiGiangEntity.prototype, "troChois", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bai_tap_entity_1.BaiTapEntity, (e) => e.baiGiang),
    __metadata("design:type", Array)
], BaiGiangEntity.prototype, "baiTaps", void 0);
exports.BaiGiangEntity = BaiGiangEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'bai_giang', synchronize: false })
], BaiGiangEntity);
//# sourceMappingURL=bai-giang.entity.js.map