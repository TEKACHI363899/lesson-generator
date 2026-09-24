import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  LessonPresentationConfig,
  VocabularyItem,
  ActionGameConfig,
  InteractiveExercise,
} from '@eng-studio/shared-types';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  grade: number;

  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsNumber()
  durationMinutes: number;

  @IsOptional()
  presentationConfig?: LessonPresentationConfig;

  @IsArray()
  vocabularyList: VocabularyItem[];

  @IsArray()
  games: ActionGameConfig[];

  @IsArray()
  exercises: InteractiveExercise[];
}

export class IngestDto {
  @IsOptional()
  @IsString()
  promptText?: string;

  @IsOptional()
  @IsArray()
  imageBase64List?: string[];

  @IsNumber()
  targetGrade: number;

  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsOptional()
  @IsNumber()
  durationMinutes?: number;
}
