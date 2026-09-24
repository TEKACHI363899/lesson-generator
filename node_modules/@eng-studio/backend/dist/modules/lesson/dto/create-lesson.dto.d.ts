import { LessonPresentationConfig, VocabularyItem, ActionGameConfig, InteractiveExercise } from '@eng-studio/shared-types';
export declare class CreateLessonDto {
    title: string;
    grade: number;
    topic: string;
    durationMinutes: number;
    presentationConfig?: LessonPresentationConfig;
    vocabularyList: VocabularyItem[];
    games: ActionGameConfig[];
    exercises: InteractiveExercise[];
}
export declare class IngestDto {
    promptText?: string;
    imageBase64List?: string[];
    targetGrade: number;
    topic: string;
    durationMinutes?: number;
}
