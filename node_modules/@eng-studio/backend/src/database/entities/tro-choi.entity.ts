import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaiGiangEntity } from './bai-giang.entity';
import { GameEngineType, GameMatchMode } from '@eng-studio/shared-types';

@Entity({ name: 'tro_choi', synchronize: false })
export class TroChoiEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Index('idx_tro_choi_bai_giang_id')
  @Column({ name: 'bai_giang_id', type: 'integer' })
  baiGiangId: number;

  @ManyToOne(() => BaiGiangEntity, (lesson: BaiGiangEntity) => lesson.troChois, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bai_giang_id' })
  baiGiang: BaiGiangEntity;

  @Index('idx_tro_choi_loai_tro_choi')
  @Column({ name: 'loai_tro_choi', type: 'varchar', length: 50 })
  loaiTroChoi: GameEngineType;

  @Column({ name: 'tieu_de_game', type: 'varchar', length: 150 })
  tieuDeGame: string;

  @Column({ name: 'che_do_choi', type: 'varchar', length: 30, default: 'TWO_TEAMS' })
  cheDoChoi: GameMatchMode;

  @Column({ name: 'vi_tri_trong_slide', type: 'integer', default: 2 })
  viTriTrongSlide: number;

  @Column({ name: 'du_lieu_cau_hoi', type: 'jsonb' })
  duLieuCauHoi: Record<string, unknown>[];
}
