import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { AiModule } from '../ai/ai.module';
import { BaiGiangEntity } from '../../database/entities/bai-giang.entity';
import { TuVungEntity } from '../../database/entities/tu-vung.entity';
import { TroChoiEntity } from '../../database/entities/tro-choi.entity';
import { BaiTapEntity } from '../../database/entities/bai-tap.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BaiGiangEntity,
      TuVungEntity,
      TroChoiEntity,
      BaiTapEntity,
    ]),
    AiModule,
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
