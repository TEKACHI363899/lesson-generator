import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { NguoiDungEntity } from './nguoi-dung.entity';
import { TuVungEntity } from './tu-vung.entity';
import { TroChoiEntity } from './tro-choi.entity';
import { BaiTapEntity } from './bai-tap.entity';

@Entity({ name: 'bai_giang', synchronize: false })
export class BaiGiangEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Index('idx_bai_giang_nguoi_dung_id')
  @Column({ name: 'nguoi_dung_id', type: 'integer' })
  nguoiDungId: number;

  @ManyToOne(() => NguoiDungEntity, (user) => user.baiGiangs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nguoi_dung_id' })
  nguoiDung: NguoiDungEntity;

  @Index('idx_bai_giang_ma_bai_giang', { unique: true })
  @Column({ name: 'ma_bai_giang', type: 'varchar', length: 20, unique: true })
  maBaiGiang: string;

  @Column({ name: 'tieu_de', type: 'varchar', length: 255 })
  tieuDe: string;

  @Index('idx_bai_giang_khoi_lop')
  @Column({ name: 'khoi_lop', type: 'smallint' })
  khoiLop: number;

  @Index('idx_bai_giang_chu_de')
  @Column({ name: 'chu_de', type: 'varchar', length: 150 })
  chuDe: string;

  @Column({ name: 'thoi_luong_phut', type: 'integer', default: 45 })
  thoiLuongPhut: number;

  @Column({ name: 'cau_hinh_trinh_chieu', type: 'jsonb', nullable: true })
  cauHinhTrinhChieu: Record<string, unknown> | null;

  @Index('idx_bai_giang_trang_thai')
  @Column({ name: 'trang_thai', type: 'smallint', default: 1 })
  trangThai: number;

  @CreateDateColumn({ name: 'tao_luc', type: 'timestamptz' })
  taoLuc: Date;

  @UpdateDateColumn({ name: 'cap_nhat_luc', type: 'timestamptz' })
  capNhatLuc: Date;

  @OneToMany(() => TuVungEntity, (v) => v.baiGiang)
  tuVungs: TuVungEntity[];

  @OneToMany(() => TroChoiEntity, (g) => g.baiGiang)
  troChois: TroChoiEntity[];

  @OneToMany(() => BaiTapEntity, (e) => e.baiGiang)
  baiTaps: BaiTapEntity[];
}
