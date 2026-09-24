import { DataSource } from 'typeorm';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { ApiResponse, LessonBundle } from '@eng-studio/shared-types';
export declare class LessonService {
    private readonly dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    private generateLessonCode;
    createLessonBundle(userId: number, dto: CreateLessonDto): Promise<ApiResponse<LessonBundle>>;
    getLessonByPinCode(code: string): Promise<ApiResponse<LessonBundle>>;
    getLessonBundleById(id: number): Promise<LessonBundle>;
    listUserLessons(userId: number): Promise<ApiResponse<LessonBundle[]>>;
    private mapEntityToBundle;
}
