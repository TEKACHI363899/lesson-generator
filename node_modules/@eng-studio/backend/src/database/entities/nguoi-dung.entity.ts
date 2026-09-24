import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { NguoiDungThietBiEntity } from './nguoi-dung-thiet-bi.entity';
import { BaiGiangEntity } from './bai-giang.entity';

@Entity({ name: 'nguoi_dung', synchronize: false })
export class NguoiDungEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Index('idx_nguoi_dung_email', { unique: true })
  @Column({ name: 'email', type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ name: 'mat_khau_hash', type: 'varchar', length: 255 })
  matKhauHash: string;

  @Column({ name: 'ho_ten', type: 'varchar', length: 150 })
  hoTen: string;

  @Index('idx_nguoi_dung_vai_tro')
  @Column({ name: 'vai_tro', type: 'varchar', length: 50, default: 'TEACHER' })
  vaiTro: string;

  @Index('idx_nguoi_dung_trang_thai')
  @Column({ name: 'trang_thai', type: 'smallint', default: 1 })
  trangThai: number;

  @CreateDateColumn({ name: 'tao_luc', type: 'timestamptz' })
  taoLuc: Date;

  @UpdateDateColumn({ name: 'cap_nhat_luc', type: 'timestamptz' })
  capNhatLuc: Date;

  @OneToMany(() => NguoiDungThietBiEntity, (device: NguoiDungThietBiEntity) => device.nguoiDung)
  thietBis: NguoiDungThietBiEntity[];

  @OneToMany(() => BaiGiangEntity, (lesson: BaiGiangEntity) => lesson.nguoiDung)
  baiGiangs: BaiGiangEntity[];
}
