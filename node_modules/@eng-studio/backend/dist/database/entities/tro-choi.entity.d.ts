import { BaiGiangEntity } from './bai-giang.entity';
import { GameEngineType, GameMatchMode } from '@eng-studio/shared-types';
export declare class TroChoiEntity {
    id: number;
    baiGiangId: number;
    baiGiang: BaiGiangEntity;
    loaiTroChoi: GameEngineType;
    tieuDeGame: string;
    cheDoChoi: GameMatchMode;
    viTriTrongSlide: number;
    duLieuCauHoi: Record<string, unknown>[];
}
