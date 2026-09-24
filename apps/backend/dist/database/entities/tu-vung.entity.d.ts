import { BaiGiangEntity } from './bai-giang.entity';
import { SyllableSegment } from '@eng-studio/shared-types';
export declare class TuVungEntity {
    id: number;
    baiGiangId: number;
    baiGiang: BaiGiangEntity;
    tuTiengAnh: string;
    nghiaTiengViet: string;
    tuLoai: string;
    phienAmIpa: string;
    cacAmTiet: SyllableSegment[];
    viDuCau: string;
    dichCau: string;
    hinhAnhUrl: string | null;
    thuTuXuatHien: number;
}
