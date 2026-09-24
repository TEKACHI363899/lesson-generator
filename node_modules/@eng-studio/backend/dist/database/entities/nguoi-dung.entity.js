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
exports.NguoiDungEntity = void 0;
const typeorm_1 = require("typeorm");
const nguoi_dung_thiet_bi_entity_1 = require("./nguoi-dung-thiet-bi.entity");
const bai_giang_entity_1 = require("./bai-giang.entity");
let NguoiDungEntity = class NguoiDungEntity {
};
exports.NguoiDungEntity = NguoiDungEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { name: 'id' }),
    __metadata("design:type", Number)
], NguoiDungEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_nguoi_dung_email', { unique: true }),
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 150, unique: true }),
    __metadata("design:type", String)
], NguoiDungEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mat_khau_hash', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], NguoiDungEntity.prototype, "matKhauHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ho_ten', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], NguoiDungEntity.prototype, "hoTen", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_nguoi_dung_vai_tro'),
    (0, typeorm_1.Column)({ name: 'vai_tro', type: 'varchar', length: 50, default: 'TEACHER' }),
    __metadata("design:type", String)
], NguoiDungEntity.prototype, "vaiTro", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_nguoi_dung_trang_thai'),
    (0, typeorm_1.Column)({ name: 'trang_thai', type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], NguoiDungEntity.prototype, "trangThai", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'tao_luc', type: 'timestamptz' }),
    __metadata("design:type", Date)
], NguoiDungEntity.prototype, "taoLuc", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'cap_nhat_luc', type: 'timestamptz' }),
    __metadata("design:type", Date)
], NguoiDungEntity.prototype, "capNhatLuc", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => nguoi_dung_thiet_bi_entity_1.NguoiDungThietBiEntity, (device) => device.nguoiDung),
    __metadata("design:type", Array)
], NguoiDungEntity.prototype, "thietBis", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bai_giang_entity_1.BaiGiangEntity, (lesson) => lesson.nguoiDung),
    __metadata("design:type", Array)
], NguoiDungEntity.prototype, "baiGiangs", void 0);
exports.NguoiDungEntity = NguoiDungEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'nguoi_dung', synchronize: false })
], NguoiDungEntity);
//# sourceMappingURL=nguoi-dung.entity.js.map