import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaiGiangEntity } from './bai-giang.entity';
import { ExerciseType } from '@eng-studio/shared-types';

@Entity({ name: 'bai_tap', synchronize: false })
export class BaiTapEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Index('idx_bai_tap_bai_giang_id')
  @Column({ name: 'bai_giang_id', type: 'integer' })
  baiGiangId: number;

  @ManyToOne(() => BaiGiangEntity, (lesson) => lesson.baiTaps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bai_giang_id' })
  baiGiang: BaiGiangEntity;

  @Index('idx_bai_tap_dang_bai_tap')
  @Column({ name: 'dang_bai_tap', type: 'varchar', length: 50 })
  dangBaiTap: ExerciseType;

  @Column({ name: 'cau_hoi', type: 'text' })
  cauHoi: string;

  @Column({ name: 'cac_lua_chon', type: 'jsonb', default: [] })
  cacLuaChon: string[];

  @Column({ name: 'dap_an_dung', type: 'text' })
  dapAnDung: string;

  @Column({ name: 'giai_thich_chi_tiet', type: 'text' })
  giaiThichChiTiet: string;

  @Column({ name: 'thu_tu_slide', type: 'integer', default: 3 })
  thuTuSlide: number;
}
