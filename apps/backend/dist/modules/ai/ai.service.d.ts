import { IngestLessonRequest, IngestionPreviewResult } from '@eng-studio/shared-types';
export declare class AiService {
    private readonly logger;
    analyzeAndExtractLesson(dto: IngestLessonRequest): Promise<IngestionPreviewResult>;
    private callGeminiVisionExtraction;
    private generateDeterministicLesson;
}
