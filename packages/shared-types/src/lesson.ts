export interface SyllableSegment {
  readonly text: string;
  readonly isStress: boolean;
}

export interface VocabularyItem {
  readonly id?: number;
  readonly word: string;
  readonly vietnameseMeaning: string;
  readonly partOfSpeech: string;
  readonly ipa: string;
  readonly syllables: readonly SyllableSegment[];
  readonly exampleSentence: string;
  readonly exampleTranslation: string;
  readonly imageUrl?: string;
  readonly orderIndex: number;
}

export type ExerciseType = 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'SENTENCE_SCRAMBLE' | 'WORD_MATCH';

export interface InteractiveExercise {
  readonly id?: number;
  readonly exerciseType: ExerciseType;
  readonly question: string;
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly explanation: string;
  readonly slideOrder: number;
}

export type GameEngineType = 'PENALTY_SHOOTOUT' | 'SPEED_RACING' | 'GOLD_QUEST' | 'BOSS_BATTLE';

export type GameMatchMode = 'SOLO_TUTOR' | 'TWO_TEAMS' | 'CLASS_COOP';

export interface ActionGameConfig {
  readonly id?: number;
  readonly gameType: GameEngineType;
  readonly title: string;
  readonly matchMode: GameMatchMode;
  readonly slidePosition: number;
  readonly questionsData: readonly InteractiveExercise[];
}

export interface LessonPresentationConfig {
  readonly theme: 'CLEAN_ACADEMIC';
  readonly fontScale: 'STANDARD' | 'LARGE' | 'PRESENTATION_BOARD';
  readonly soundEnabled: boolean;
}

export interface CreateLessonDto {
  readonly title: string;
  readonly grade: number;
  readonly topic: string;
  readonly durationMinutes: number;
  readonly presentationConfig?: LessonPresentationConfig;
  readonly vocabularyList: readonly VocabularyItem[];
  readonly games: readonly ActionGameConfig[];
  readonly exercises: readonly InteractiveExercise[];
}

export interface LessonBundle {
  readonly id?: number;
  readonly lessonCode: string;
  readonly title: string;
  readonly grade: number;
  readonly topic: string;
  readonly durationMinutes: number;
  readonly presentationConfig: LessonPresentationConfig;
  readonly vocabularyList: readonly VocabularyItem[];
  readonly games: readonly ActionGameConfig[];
  readonly exercises: readonly InteractiveExercise[];
  readonly createdAt?: string;
}

export interface IngestLessonRequest {
  readonly promptText?: string;
  readonly imageBase64List?: readonly string[];
  readonly targetGrade: number;
  readonly topic: string;
  readonly durationMinutes?: number;
}

export interface IngestionPreviewResult {
  readonly title: string;
  readonly targetGrade: number;
  readonly topic: string;
  readonly durationMinutes: number;
  readonly vocabularyList: readonly VocabularyItem[];
  readonly suggestedExercises: readonly InteractiveExercise[];
}
