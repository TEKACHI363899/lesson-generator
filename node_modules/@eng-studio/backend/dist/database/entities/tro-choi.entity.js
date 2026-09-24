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
exports.TroChoiEntity = void 0;
const typeorm_1 = require("typeorm");
const bai_giang_entity_1 = require("./bai-giang.entity");
let TroChoiEntity = class TroChoiEntity {
};
exports.TroChoiEntity = TroChoiEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { name: 'id' }),
    __metadata("design:type", Number)
], TroChoiEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_tro_choi_bai_giang_id'),
    (0, typeorm_1.Column)({ name: 'bai_giang_id', type: 'integer' }),
    __metadata("design:type", Number)
], TroChoiEntity.prototype, "baiGiangId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bai_giang_entity_1.BaiGiangEntity, (lesson) => lesson.troChois, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'bai_giang_id' }),
    __metadata("design:type", bai_giang_entity_1.BaiGiangEntity)
], TroChoiEntity.prototype, "baiGiang", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_tro_choi_loai_tro_choi'),
    (0, typeorm_1.Column)({ name: 'loai_tro_choi', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], TroChoiEntity.prototype, "loaiTroChoi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tieu_de_game', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], TroChoiEntity.prototype, "tieuDeGame", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'che_do_choi', type: 'varchar', length: 30, default: 'TWO_TEAMS' }),
    __metadata("design:type", String)
], TroChoiEntity.prototype, "cheDoChoi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vi_tri_trong_slide', type: 'integer', default: 2 }),
    __metadata("design:type", Number)
], TroChoiEntity.prototype, "viTriTrongSlide", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'du_lieu_cau_hoi', type: 'jsonb' }),
    __metadata("design:type", Array)
], TroChoiEntity.prototype, "duLieuCauHoi", void 0);
exports.TroChoiEntity = TroChoiEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'tro_choi', synchronize: false })
], TroChoiEntity);
//# sourceMappingURL=tro-choi.entity.js.map