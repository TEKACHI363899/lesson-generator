import { ApiResponse } from '@eng-studio/shared-types';
export declare class AppController {
    getHealth(): ApiResponse<{
        status: string;
        uptime: number;
    }>;
}
