import { Request } from 'express';
import { LessonService } from './lesson.service';
import { AiService } from '../ai/ai.service';
import { CreateLessonDto, IngestDto } from './dto/create-lesson.dto';
import { ApiResponse, LessonBundle, IngestionPreviewResult, JwtPayload } from '@eng-studio/shared-types';
export declare class LessonController {
    private readonly lessonService;
    private readonly aiService;
    constructor(lessonService: LessonService, aiService: AiService);
    ingestContent(dto: IngestDto): Promise<ApiResponse<IngestionPreviewResult>>;
    getLessonByPin(code: string): Promise<ApiResponse<LessonBundle>>;
    createLesson(req: Request & {
        user: JwtPayload;
    }, dto: CreateLessonDto): Promise<ApiResponse<LessonBundle>>;
    listUserLessons(req: Request & {
        user: JwtPayload;
    }): Promise<ApiResponse<LessonBundle[]>>;
    getLessonDetail(id: string): Promise<ApiResponse<LessonBundle>>;
}
