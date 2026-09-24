import { BaiGiangEntity } from './bai-giang.entity';
import { ExerciseType } from '@eng-studio/shared-types';
export declare class BaiTapEntity {
    id: number;
    baiGiangId: number;
    baiGiang: BaiGiangEntity;
    dangBaiTap: ExerciseType;
    cauHoi: string;
    cacLuaChon: string[];
    dapAnDung: string;
    giaiThichChiTiet: string;
    thuTuSlide: number;
}
