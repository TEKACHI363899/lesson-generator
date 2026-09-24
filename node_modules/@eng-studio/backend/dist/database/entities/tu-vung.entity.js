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
exports.TuVungEntity = void 0;
const typeorm_1 = require("typeorm");
const bai_giang_entity_1 = require("./bai-giang.entity");
let TuVungEntity = class TuVungEntity {
};
exports.TuVungEntity = TuVungEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { name: 'id' }),
    __metadata("design:type", Number)
], TuVungEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_tu_vung_bai_giang_id'),
    (0, typeorm_1.Column)({ name: 'bai_giang_id', type: 'integer' }),
    __metadata("design:type", Number)
], TuVungEntity.prototype, "baiGiangId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bai_giang_entity_1.BaiGiangEntity, (lesson) => lesson.tuVungs, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'bai_giang_id' }),
    __metadata("design:type", bai_giang_entity_1.BaiGiangEntity)
], TuVungEntity.prototype, "baiGiang", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_tu_vung_tu_tieng_anh'),
    (0, typeorm_1.Column)({ name: 'tu_tieng_anh', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], TuVungEntity.prototype, "tuTiengAnh", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nghia_tieng_viet', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], TuVungEntity.prototype, "nghiaTiengViet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tu_loai', type: 'varchar', length: 30, default: 'noun' }),
    __metadata("design:type", String)
], TuVungEntity.prototype, "tuLoai", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phien_am_ipa', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], TuVungEntity.prototype, "phienAmIpa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cac_am_tiet', type: 'jsonb' }),
    __metadata("design:type", Array)
], TuVungEntity.prototype, "cacAmTiet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vi_du_cau', type: 'text' }),
    __metadata("design:type", String)
], TuVungEntity.prototype, "viDuCau", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dich_cau', type: 'text' }),
    __metadata("design:type", String)
], TuVungEntity.prototype, "dichCau", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hinh_anh_url', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TuVungEntity.prototype, "hinhAnhUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'thu_tu_xuat_hien', type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], TuVungEntity.prototype, "thuTuXuatHien", void 0);
exports.TuVungEntity = TuVungEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'tu_vung', synchronize: false })
], TuVungEntity);
//# sourceMappingURL=tu-vung.entity.js.map