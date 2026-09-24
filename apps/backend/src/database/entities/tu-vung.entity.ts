import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaiGiangEntity } from './bai-giang.entity';
import { SyllableSegment } from '@eng-studio/shared-types';

@Entity({ name: 'tu_vung', synchronize: false })
export class TuVungEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Index('idx_tu_vung_bai_giang_id')
  @Column({ name: 'bai_giang_id', type: 'integer' })
  baiGiangId: number;

  @ManyToOne(() => BaiGiangEntity, (lesson: BaiGiangEntity) => lesson.tuVungs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bai_giang_id' })
  baiGiang: BaiGiangEntity;

  @Index('idx_tu_vung_tu_tieng_anh')
  @Column({ name: 'tu_tieng_anh', type: 'varchar', length: 120 })
  tuTiengAnh: string;

  @Column({ name: 'nghia_tieng_viet', type: 'varchar', length: 255 })
  nghiaTiengViet: string;

  @Column({ name: 'tu_loai', type: 'varchar', length: 30, default: 'noun' })
  tuLoai: string;

  @Column({ name: 'phien_am_ipa', type: 'varchar', length: 120 })
  phienAmIpa: string;

  @Column({ name: 'cac_am_tiet', type: 'jsonb' })
  cacAmTiet: SyllableSegment[];

  @Column({ name: 'vi_du_cau', type: 'text' })
  viDuCau: string;

  @Column({ name: 'dich_cau', type: 'text' })
  dichCau: string;

  @Column({ name: 'hinh_anh_url', type: 'text', nullable: true })
  hinhAnhUrl: string | null;

  @Column({ name: 'thu_tu_xuat_hien', type: 'integer', default: 1 })
  thuTuXuatHien: number;
}
