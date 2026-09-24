import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NguoiDungEntity } from './nguoi-dung.entity';

@Entity({ name: 'nguoi_dung_thiet_bi', synchronize: false })
export class NguoiDungThietBiEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Index('idx_nguoi_dung_thiet_bi_nguoi_dung_id')
  @Column({ name: 'nguoi_dung_id', type: 'integer' })
  nguoiDungId: number;

  @ManyToOne(() => NguoiDungEntity, (user) => user.thietBis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nguoi_dung_id' })
  nguoiDung: NguoiDungEntity;

  @Index('idx_nguoi_dung_thiet_bi_device_id')
  @Column({ name: 'device_id', type: 'varchar', length: 128 })
  deviceId: string;

  @Column({ name: 'jwt_token', type: 'varchar', length: 512 })
  jwtToken: string;

  @Index('idx_nguoi_dung_thiet_bi_het_han_luc')
  @Column({ name: 'het_han_luc', type: 'timestamptz' })
  hetHanLuc: Date;

  @Column({ name: 'hoat_dong', type: 'boolean', default: true })
  hoatDong: boolean;

  @CreateDateColumn({ name: 'tao_luc', type: 'timestamptz' })
  taoLuc: Date;
}
