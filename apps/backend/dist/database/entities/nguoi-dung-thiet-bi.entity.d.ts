import { NguoiDungEntity } from './nguoi-dung.entity';
export declare class NguoiDungThietBiEntity {
    id: number;
    nguoiDungId: number;
    nguoiDung: NguoiDungEntity;
    deviceId: string;
    jwtToken: string;
    hetHanLuc: Date;
    hoatDong: boolean;
    taoLuc: Date;
}
