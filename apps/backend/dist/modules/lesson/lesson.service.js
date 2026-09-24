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
var LessonService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const bai_giang_entity_1 = require("../../database/entities/bai-giang.entity");
const tu_vung_entity_1 = require("../../database/entities/tu-vung.entity");
const tro_choi_entity_1 = require("../../database/entities/tro-choi.entity");
const bai_tap_entity_1 = require("../../database/entities/bai-tap.entity");
let LessonService = LessonService_1 = class LessonService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(LessonService_1.name);
    }
    generateLessonCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `ENG-${code}`;
    }
    async createLessonBundle(userId, dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const lessonCode = this.generateLessonCode();
            const newLesson = queryRunner.manager.create(bai_giang_entity_1.BaiGiangEntity, {
                nguoiDungId: userId,
                maBaiGiang: lessonCode,
                tieuDe: dto.title,
                khoiLop: dto.grade,
                chuDe: dto.topic,
                thoiLuongPhut: dto.durationMinutes,
                cauHinhTrinhChieu: dto.presentationConfig ?? {
                    theme: 'CLEAN_ACADEMIC',
                    fontScale: 'PRESENTATION_BOARD',
                    soundEnabled: true,
                },
                trangThai: 1,
            });
            const savedLesson = await queryRunner.manager.save(bai_giang_entity_1.BaiGiangEntity, newLesson);
            const lessonId = savedLesson.id;
            if (dto.vocabularyList && dto.vocabularyList.length > 0) {
                const vocabEntities = dto.vocabularyList.map((item, index) => queryRunner.manager.create(tu_vung_entity_1.TuVungEntity, {
                    baiGiangId: lessonId,
                    tuTiengAnh: item.word,
                    nghiaTiengViet: item.vietnameseMeaning,
                    tuLoai: item.partOfSpeech || 'noun',
                    phienAmIpa: item.ipa,
                    cacAmTiet: [...item.syllables],
                    viDuCau: item.exampleSentence,
                    dichCau: item.exampleTranslation,
                    hinhAnhUrl: item.imageUrl || null,
                    thuTuXuatHien: index + 1,
                }));
                await queryRunner.manager.save(tu_vung_entity_1.TuVungEntity, vocabEntities);
            }
            if (dto.games && dto.games.length > 0) {
                const gameEntities = dto.games.map((g) => queryRunner.manager.create(tro_choi_entity_1.TroChoiEntity, {
                    baiGiangId: lessonId,
                    loaiTroChoi: g.gameType,
                    tieuDeGame: g.title,
                    cheDoChoi: g.matchMode,
                    viTriTrongSlide: g.slidePosition,
                    duLieuCauHoi: g.questionsData,
                }));
                await queryRunner.manager.save(tro_choi_entity_1.TroChoiEntity, gameEntities);
            }
            if (dto.exercises && dto.exercises.length > 0) {
                const exerciseEntities = dto.exercises.map((ex) => queryRunner.manager.create(bai_tap_entity_1.BaiTapEntity, {
                    baiGiangId: lessonId,
                    dangBaiTap: ex.exerciseType,
                    cauHoi: ex.question,
                    cacLuaChon: [...ex.options],
                    dapAnDung: ex.correctAnswer,
                    giaiThichChiTiet: ex.explanation,
                    thuTuSlide: ex.slideOrder,
                }));
                await queryRunner.manager.save(bai_tap_entity_1.BaiTapEntity, exerciseEntities);
            }
            await queryRunner.commitTransaction();
            const result = await this.getLessonBundleById(lessonId);
            return {
                code: 201,
                status: true,
                message: 'Tạo bài giảng thành công',
                data: result,
            };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Create Lesson Bundle Transaction Failed: ${err instanceof Error ? err.message : String(err)}`);
            throw new common_1.BadRequestException('Không thể lưu bài giảng. Đã hoàn tác giao dịch.');
        }
        finally {
            await queryRunner.release();
        }
    }
    async getLessonByPinCode(code) {
        const cleanCode = code.trim().toUpperCase();
        const lesson = await this.dataSource.getRepository(bai_giang_entity_1.BaiGiangEntity).findOne({
            where: { maBaiGiang: cleanCode, trangThai: 1 },
            relations: ['tuVungs', 'troChois', 'baiTaps'],
        });
        if (!lesson) {
            throw new common_1.NotFoundException(`Không tìm thấy bài giảng với mã ${cleanCode}`);
        }
        return {
            code: 200,
            status: true,
            message: 'OK',
            data: this.mapEntityToBundle(lesson),
        };
    }
    async getLessonBundleById(id) {
        const lesson = await this.dataSource.getRepository(bai_giang_entity_1.BaiGiangEntity).findOne({
            where: { id },
            relations: ['tuVungs', 'troChois', 'baiTaps'],
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Không tìm thấy bài giảng');
        }
        return this.mapEntityToBundle(lesson);
    }
    async listUserLessons(userId) {
        const lessons = await this.dataSource.getRepository(bai_giang_entity_1.BaiGiangEntity).find({
            where: { nguoiDungId: userId, trangThai: 1 },
            relations: ['tuVungs', 'troChois', 'baiTaps'],
            order: { taoLuc: 'DESC' },
        });
        return {
            code: 200,
            status: true,
            message: 'OK',
            data: lessons.map((l) => this.mapEntityToBundle(l)),
        };
    }
    mapEntityToBundle(entity) {
        return {
            id: entity.id,
            lessonCode: entity.maBaiGiang,
            title: entity.tieuDe,
            grade: entity.khoiLop,
            topic: entity.chuDe,
            durationMinutes: entity.thoiLuongPhut,
            presentationConfig: entity.cauHinhTrinhChieu ?? {
                theme: 'CLEAN_ACADEMIC',
                fontScale: 'PRESENTATION_BOARD',
                soundEnabled: true,
            },
            vocabularyList: (entity.tuVungs ?? [])
                .sort((a, b) => a.thuTuXuatHien - b.thuTuXuatHien)
                .map((v) => ({
                id: v.id,
                word: v.tuTiengAnh,
                vietnameseMeaning: v.nghiaTiengViet,
                partOfSpeech: v.tuLoai,
                ipa: v.phienAmIpa,
                syllables: v.cacAmTiet,
                exampleSentence: v.viDuCau,
                exampleTranslation: v.dichCau,
                imageUrl: v.hinhAnhUrl ?? undefined,
                orderIndex: v.thuTuXuatHien,
            })),
            games: (entity.troChois ?? []).map((g) => ({
                id: g.id,
                gameType: g.loaiTroChoi,
                title: g.tieuDeGame,
                matchMode: g.cheDoChoi,
                slidePosition: g.viTriTrongSlide,
                questionsData: (g.duLieuCauHoi ?? []),
            })),
            exercises: (entity.baiTaps ?? [])
                .sort((a, b) => a.thuTuSlide - b.thuTuSlide)
                .map((e) => ({
                id: e.id,
                exerciseType: e.dangBaiTap,
                question: e.cauHoi,
                options: e.cacLuaChon ?? [],
                correctAnswer: e.dapAnDung,
                explanation: e.giaiThichChiTiet,
                slideOrder: e.thuTuSlide,
            })),
            createdAt: entity.taoLuc.toISOString(),
        };
    }
};
exports.LessonService = LessonService;
exports.LessonService = LessonService = LessonService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], LessonService);
//# sourceMappingURL=lesson.service.js.map