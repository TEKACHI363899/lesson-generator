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
exports.NguoiDungThietBiEntity = void 0;
const typeorm_1 = require("typeorm");
const nguoi_dung_entity_1 = require("./nguoi-dung.entity");
let NguoiDungThietBiEntity = class NguoiDungThietBiEntity {
};
exports.NguoiDungThietBiEntity = NguoiDungThietBiEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { name: 'id' }),
    __metadata("design:type", Number)
], NguoiDungThietBiEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_nguoi_dung_thiet_bi_nguoi_dung_id'),
    (0, typeorm_1.Column)({ name: 'nguoi_dung_id', type: 'integer' }),
    __metadata("design:type", Number)
], NguoiDungThietBiEntity.prototype, "nguoiDungId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nguoi_dung_entity_1.NguoiDungEntity, (user) => user.thietBis, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'nguoi_dung_id' }),
    __metadata("design:type", nguoi_dung_entity_1.NguoiDungEntity)
], NguoiDungThietBiEntity.prototype, "nguoiDung", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_nguoi_dung_thiet_bi_device_id'),
    (0, typeorm_1.Column)({ name: 'device_id', type: 'varchar', length: 128 }),
    __metadata("design:type", String)
], NguoiDungThietBiEntity.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'jwt_token', type: 'varchar', length: 512 }),
    __metadata("design:type", String)
], NguoiDungThietBiEntity.prototype, "jwtToken", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_nguoi_dung_thiet_bi_het_han_luc'),
    (0, typeorm_1.Column)({ name: 'het_han_luc', type: 'timestamptz' }),
    __metadata("design:type", Date)
], NguoiDungThietBiEntity.prototype, "hetHanLuc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hoat_dong', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], NguoiDungThietBiEntity.prototype, "hoatDong", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'tao_luc', type: 'timestamptz' }),
    __metadata("design:type", Date)
], NguoiDungThietBiEntity.prototype, "taoLuc", void 0);
exports.NguoiDungThietBiEntity = NguoiDungThietBiEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'nguoi_dung_thiet_bi', synchronize: false })
], NguoiDungThietBiEntity);
//# sourceMappingURL=nguoi-dung-thiet-bi.entity.js.map