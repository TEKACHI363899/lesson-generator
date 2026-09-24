import { NguoiDungThietBiEntity } from './nguoi-dung-thiet-bi.entity';
import { BaiGiangEntity } from './bai-giang.entity';
export declare class NguoiDungEntity {
    id: number;
    email: string;
    matKhauHash: string;
    hoTen: string;
    vaiTro: string;
    trangThai: number;
    taoLuc: Date;
    capNhatLuc: Date;
    thietBis: NguoiDungThietBiEntity[];
    baiGiangs: BaiGiangEntity[];
}
