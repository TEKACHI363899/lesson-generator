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
const bcrypt = __importStar(require("bcrypt"));
const data_source_1 = require("../../config/data-source");
const nguoi_dung_entity_1 = require("../entities/nguoi-dung.entity");
const bai_giang_entity_1 = require("../entities/bai-giang.entity");
const tu_vung_entity_1 = require("../entities/tu-vung.entity");
const tro_choi_entity_1 = require("../entities/tro-choi.entity");
const bai_tap_entity_1 = require("../entities/bai-tap.entity");
async function seed() {
    const dataSource = await data_source_1.AppDataSource.initialize();
    await dataSource.synchronize();
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const userRepo = queryRunner.manager.getRepository(nguoi_dung_entity_1.NguoiDungEntity);
        let admin = await userRepo.findOne({ where: { email: 'teacher@school.edu.vn' } });
        if (!admin) {
            const passwordHash = await bcrypt.hash('Teacher@2026', 10);
            admin = userRepo.create({
                email: 'teacher@school.edu.vn',
                matKhauHash: passwordHash,
                hoTen: 'Thầy Nguyễn Văn An',
                vaiTro: 'TEACHER',
                trangThai: 1,
            });
            admin = await userRepo.save(admin);
        }
        const lessonRepo = queryRunner.manager.getRepository(bai_giang_entity_1.BaiGiangEntity);
        let sampleLesson = await lessonRepo.findOne({ where: { maBaiGiang: 'ENG-8492' } });
        if (!sampleLesson) {
            sampleLesson = lessonRepo.create({
                nguoiDungId: admin.id,
                maBaiGiang: 'ENG-8492',
                tieuDe: 'Unit 4: My Neighbourhood - Places & Adjectives',
                khoiLop: 6,
                chuDe: 'My Neighbourhood',
                thoiLuongPhut: 45,
                cauHinhTrinhChieu: {
                    theme: 'CLEAN_ACADEMIC',
                    fontScale: 'PRESENTATION_BOARD',
                    soundEnabled: true,
                },
                trangThai: 1,
            });
            sampleLesson = await lessonRepo.save(sampleLesson);
            const vocabRepo = queryRunner.manager.getRepository(tu_vung_entity_1.TuVungEntity);
            const vocabList = [
                {
                    baiGiangId: sampleLesson.id,
                    tuTiengAnh: 'neighbourhood',
                    nghiaTiengViet: 'Khu phố, xóm giềng',
                    tuLoai: 'noun',
                    phienAmIpa: '/ˈneɪ.bə.hʊd/',
                    cacAmTiet: [
                        { text: 'neigh', isStress: true },
                        { text: 'bour', isStress: false },
                        { text: 'hood', isStress: false },
                    ],
                    viDuCau: 'There are many friendly people living in my neighbourhood.',
                    dichCau: 'Có rất nhiều người thân thiện sống trong khu phố của tôi.',
                    thuTuXuatHien: 1,
                },
                {
                    baiGiangId: sampleLesson.id,
                    tuTiengAnh: 'convenient',
                    nghiaTiengViet: 'Thuận tiện, tiện nghi',
                    tuLoai: 'adjective',
                    phienAmIpa: '/kənˈviː.ni.ənt/',
                    cacAmTiet: [
                        { text: 'con', isStress: false },
                        { text: 've', isStress: true },
                        { text: 'ni', isStress: false },
                        { text: 'ent', isStress: false },
                    ],
                    viDuCau: 'The modern supermarket is very convenient for buying groceries.',
                    dichCau: 'Siêu thị hiện đại rất thuận tiện để mua đồ tạp hóa.',
                    thuTuXuatHien: 2,
                },
                {
                    baiGiangId: sampleLesson.id,
                    tuTiengAnh: 'historic',
                    nghiaTiengViet: 'Mang tính lịch sử, cổ kính',
                    tuLoai: 'adjective',
                    phienAmIpa: '/hɪˈstɒr.ɪk/',
                    cacAmTiet: [
                        { text: 'his', isStress: false },
                        { text: 'tor', isStress: true },
                        { text: 'ic', isStress: false },
                    ],
                    viDuCau: 'Hoi An is a famous historic town with preserved architecture.',
                    dichCau: 'Hội An là một đô thị cổ kính nổi tiếng với kiến trúc được bảo tồn.',
                    thuTuXuatHien: 3,
                },
                {
                    baiGiangId: sampleLesson.id,
                    tuTiengAnh: 'fantastic',
                    nghiaTiengViet: 'Tuyệt vời, kỳ diệu',
                    tuLoai: 'adjective',
                    phienAmIpa: '/fænˈtæs.tɪk/',
                    cacAmTiet: [
                        { text: 'fan', isStress: false },
                        { text: 'tas', isStress: true },
                        { text: 'tic', isStress: false },
                    ],
                    viDuCau: 'The atmosphere at the school football match was fantastic.',
                    dichCau: 'Bầu không khí trong trận đấu bóng đá của trường thật tuyệt vời.',
                    thuTuXuatHien: 4,
                },
                {
                    baiGiangId: sampleLesson.id,
                    tuTiengAnh: 'multiple',
                    nghiaTiengViet: 'Nhiều, đa dạng',
                    tuLoai: 'adjective',
                    phienAmIpa: '/ˈmʌl.tɪ.pəl/',
                    cacAmTiet: [
                        { text: 'mul', isStress: true },
                        { text: 'ti', isStress: false },
                        { text: 'ple', isStress: false },
                    ],
                    viDuCau: 'Our striker had multiple chances to score penalty goals.',
                    dichCau: 'Tiền đạo của chúng tôi đã có nhiều cơ hội ghi bàn sút phạt đền.',
                    thuTuXuatHien: 5,
                },
            ];
            await vocabRepo.save(vocabRepo.create(vocabList));
            const exerciseRepo = queryRunner.manager.getRepository(bai_tap_entity_1.BaiTapEntity);
            const exercises = [
                {
                    baiGiangId: sampleLesson.id,
                    dangBaiTap: 'MULTIPLE_CHOICE',
                    cauHoi: 'Living in this suburb is very _______ because the bus stop is right in front of the house.',
                    cacLuaChon: ['convenient', 'boring', 'noisy', 'crowded'],
                    dapAnDung: 'convenient',
                    giaiThichChiTiet: 'Tính từ "convenient" (thuận tiện) phù hợp với ngữ cảnh trạm xe buýt ở ngay trước nhà.',
                    thuTuSlide: 1,
                },
                {
                    baiGiangId: sampleLesson.id,
                    dangBaiTap: 'FILL_BLANK',
                    cauHoi: 'The ancient pagoda is one of the most famous _______ buildings in the province.',
                    cacLuaChon: [],
                    dapAnDung: 'historic',
                    giaiThichChiTiet: 'Điền từ "historic" (mang tính lịch sử) để miêu tả ngôi chùa cổ.',
                    thuTuSlide: 2,
                },
                {
                    baiGiangId: sampleLesson.id,
                    dangBaiTap: 'SENTENCE_SCRAMBLE',
                    cauHoi: 'people / very / in / friendly / my / are / neighbourhood / .',
                    cacLuaChon: ['People', 'in', 'my', 'neighbourhood', 'are', 'very', 'friendly.'],
                    dapAnDung: 'People in my neighbourhood are very friendly.',
                    giaiThichChiTiet: 'Cấu trúc câu khẳng định chuẩn: People in my neighbourhood (Chủ ngữ) + are (to be) + very friendly (Vị ngữ).',
                    thuTuSlide: 3,
                },
            ];
            await exerciseRepo.save(exerciseRepo.create(exercises));
            const gameRepo = queryRunner.manager.getRepository(tro_choi_entity_1.TroChoiEntity);
            const games = [
                {
                    baiGiangId: sampleLesson.id,
                    loaiTroChoi: 'PENALTY_SHOOTOUT',
                    tieuDeGame: 'Sút bóng Penalty: Chinh phục khung thành',
                    cheDoChoi: 'TWO_TEAMS',
                    viTriTrongSlide: 2,
                    duLieuCauHoi: exercises,
                },
                {
                    baiGiangId: sampleLesson.id,
                    loaiTroChoi: 'SPEED_RACING',
                    tieuDeGame: 'Đua xe Turbo: Bứt tốc Nitro',
                    cheDoChoi: 'TWO_TEAMS',
                    viTriTrongSlide: 3,
                    duLieuCauHoi: exercises,
                },
            ];
            await gameRepo.save(gameRepo.create(games));
        }
        await queryRunner.commitTransaction();
        console.log('Seed completed successfully. Sample Lesson PIN: ENG-8492');
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('Seed failed:', error);
        throw error;
    }
    finally {
        await queryRunner.release();
        await dataSource.destroy();
    }
}
void seed();
//# sourceMappingURL=initial-seed.js.map