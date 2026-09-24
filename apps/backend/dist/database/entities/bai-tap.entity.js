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
exports.BaiTapEntity = void 0;
const typeorm_1 = require("typeorm");
const bai_giang_entity_1 = require("./bai-giang.entity");
let BaiTapEntity = class BaiTapEntity {
};
exports.BaiTapEntity = BaiTapEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { name: 'id' }),
    __metadata("design:type", Number)
], BaiTapEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_bai_tap_bai_giang_id'),
    (0, typeorm_1.Column)({ name: 'bai_giang_id', type: 'integer' }),
    __metadata("design:type", Number)
], BaiTapEntity.prototype, "baiGiangId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bai_giang_entity_1.BaiGiangEntity, (lesson) => lesson.baiTaps, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'bai_giang_id' }),
    __metadata("design:type", bai_giang_entity_1.BaiGiangEntity)
], BaiTapEntity.prototype, "baiGiang", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_bai_tap_dang_bai_tap'),
    (0, typeorm_1.Column)({ name: 'dang_bai_tap', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], BaiTapEntity.prototype, "dangBaiTap", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cau_hoi', type: 'text' }),
    __metadata("design:type", String)
], BaiTapEntity.prototype, "cauHoi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cac_lua_chon', type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], BaiTapEntity.prototype, "cacLuaChon", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dap_an_dung', type: 'text' }),
    __metadata("design:type", String)
], BaiTapEntity.prototype, "dapAnDung", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'giai_thich_chi_tiet', type: 'text' }),
    __metadata("design:type", String)
], BaiTapEntity.prototype, "giaiThichChiTiet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'thu_tu_slide', type: 'integer', default: 3 }),
    __metadata("design:type", Number)
], BaiTapEntity.prototype, "thuTuSlide", void 0);
exports.BaiTapEntity = BaiTapEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'bai_tap', synchronize: false })
], BaiTapEntity);
//# sourceMappingURL=bai-tap.entity.js.map