import { NguoiDungEntity } from './nguoi-dung.entity';
import { TuVungEntity } from './tu-vung.entity';
import { TroChoiEntity } from './tro-choi.entity';
import { BaiTapEntity } from './bai-tap.entity';
export declare class BaiGiangEntity {
    id: number;
    nguoiDungId: number;
    nguoiDung: NguoiDungEntity;
    maBaiGiang: string;
    tieuDe: string;
    khoiLop: number;
    chuDe: string;
    thoiLuongPhut: number;
    cauHinhTrinhChieu: Record<string, unknown> | null;
    trangThai: number;
    taoLuc: Date;
    capNhatLuc: Date;
    tuVungs: TuVungEntity[];
    troChois: TroChoiEntity[];
    baiTaps: BaiTapEntity[];
}
