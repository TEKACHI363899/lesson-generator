import { ApiResponse } from '@eng-studio/shared-types';
export interface StudioSelectOptions {
    grades: {
        label: string;
        value: number;
    }[];
    gameEngines: {
        label: string;
        value: string;
        description: string;
    }[];
    exerciseTypes: {
        label: string;
        value: string;
    }[];
}
export declare class OptionsController {
    getOptions(): ApiResponse<StudioSelectOptions>;
}
