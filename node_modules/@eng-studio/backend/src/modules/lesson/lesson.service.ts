import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaiGiangEntity } from '../../database/entities/bai-giang.entity';
import { TuVungEntity } from '../../database/entities/tu-vung.entity';
import { TroChoiEntity } from '../../database/entities/tro-choi.entity';
import { BaiTapEntity } from '../../database/entities/bai-tap.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { ApiResponse, LessonBundle, ActionGameConfig } from '@eng-studio/shared-types';

@Injectable()
export class LessonService {
  private readonly logger = new Logger(LessonService.name);

  constructor(private readonly dataSource: DataSource) {}

  private generateLessonCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ENG-${code}`;
  }

  async createLessonBundle(
    userId: number,
    dto: CreateLessonDto,
  ): Promise<ApiResponse<LessonBundle>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const lessonCode = this.generateLessonCode();

      // 1. Create BaiGiang main record
      const newLesson = queryRunner.manager.create(BaiGiangEntity, {
        nguoiDungId: userId,
        maBaiGiang: lessonCode,
        tieuDe: dto.title,
        khoiLop: dto.grade,
        chuDe: dto.topic,
        thoiLuongPhut: dto.durationMinutes,
        cauHinhTrinhChieu: (dto.presentationConfig as unknown as Record<string, unknown>) ?? {
          theme: 'CLEAN_ACADEMIC',
          fontScale: 'PRESENTATION_BOARD',
          soundEnabled: true,
        },
        trangThai: 1,
      });

      const savedLesson = await queryRunner.manager.save(BaiGiangEntity, newLesson);
      const lessonId = savedLesson.id;

      // 2. Create TuVung records
      if (dto.vocabularyList && dto.vocabularyList.length > 0) {
        const vocabEntities = dto.vocabularyList.map((item, index) =>
          queryRunner.manager.create(TuVungEntity, {
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
          }),
        );
        await queryRunner.manager.save(TuVungEntity, vocabEntities);
      }

      // 3. Create TroChoi records (Action games: Penalty, Racing, Chest, Boss)
      if (dto.games && dto.games.length > 0) {
        const gameEntities = dto.games.map((g) =>
          queryRunner.manager.create(TroChoiEntity, {
            baiGiangId: lessonId,
            loaiTroChoi: g.gameType,
            tieuDeGame: g.title,
            cheDoChoi: g.matchMode,
            viTriTrongSlide: g.slidePosition,
            duLieuCauHoi: g.questionsData as unknown as Record<string, unknown>[],
          }),
        );
        await queryRunner.manager.save(TroChoiEntity, gameEntities);
      }

      // 4. Create BaiTap records
      if (dto.exercises && dto.exercises.length > 0) {
        const exerciseEntities = dto.exercises.map((ex) =>
          queryRunner.manager.create(BaiTapEntity, {
            baiGiangId: lessonId,
            dangBaiTap: ex.exerciseType,
            cauHoi: ex.question,
            cacLuaChon: [...ex.options],
            dapAnDung: ex.correctAnswer,
            giaiThichChiTiet: ex.explanation,
            thuTuSlide: ex.slideOrder,
          }),
        );
        await queryRunner.manager.save(BaiTapEntity, exerciseEntities);
      }

      await queryRunner.commitTransaction();

      const result = await this.getLessonBundleById(lessonId);
      return {
        code: 201,
        status: true,
        message: 'Tạo bài giảng thành công',
        data: result,
      };
    } catch (err: unknown) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Create Lesson Bundle Transaction Failed: ${err instanceof Error ? err.message : String(err)}`);
      throw new BadRequestException('Không thể lưu bài giảng. Đã hoàn tác giao dịch.');
    } finally {
      await queryRunner.release();
    }
  }

  async getLessonByPinCode(code: string): Promise<ApiResponse<LessonBundle>> {
    const cleanCode = code.trim().toUpperCase();
    const lesson = await this.dataSource.getRepository(BaiGiangEntity).findOne({
      where: { maBaiGiang: cleanCode, trangThai: 1 },
      relations: ['tuVungs', 'troChois', 'baiTaps'],
    });

    if (!lesson) {
      throw new NotFoundException(`Không tìm thấy bài giảng với mã ${cleanCode}`);
    }

    return {
      code: 200,
      status: true,
      message: 'OK',
      data: this.mapEntityToBundle(lesson),
    };
  }

  async getLessonBundleById(id: number): Promise<LessonBundle> {
    const lesson = await this.dataSource.getRepository(BaiGiangEntity).findOne({
      where: { id },
      relations: ['tuVungs', 'troChois', 'baiTaps'],
    });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài giảng');
    }

    return this.mapEntityToBundle(lesson);
  }

  async listUserLessons(userId: number): Promise<ApiResponse<LessonBundle[]>> {
    const lessons = await this.dataSource.getRepository(BaiGiangEntity).find({
      where: { nguoiDungId: userId, trangThai: 1 },
      relations: ['tuVungs', 'troChois', 'baiTaps'],
      order: { taoLuc: 'DESC' },
    });

    return {
      code: 200,
      status: true,
      message: 'OK',
      data: lessons.map((l: BaiGiangEntity) => this.mapEntityToBundle(l)),
    };
  }

  private mapEntityToBundle(entity: BaiGiangEntity): LessonBundle {
    return {
      id: entity.id,
      lessonCode: entity.maBaiGiang,
      title: entity.tieuDe,
      grade: entity.khoiLop,
      topic: entity.chuDe,
      durationMinutes: entity.thoiLuongPhut,
      presentationConfig: (entity.cauHinhTrinhChieu as unknown as LessonBundle['presentationConfig']) ?? {
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
        questionsData: (g.duLieuCauHoi ?? []) as unknown as ActionGameConfig['questionsData'],
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
}
