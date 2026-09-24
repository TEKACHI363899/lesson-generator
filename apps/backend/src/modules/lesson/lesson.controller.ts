import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { LessonService } from './lesson.service';
import { AiService } from '../ai/ai.service';
import { CreateLessonDto, IngestDto } from './dto/create-lesson.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiResponse,
  LessonBundle,
  IngestionPreviewResult,
  JwtPayload,
} from '@eng-studio/shared-types';

@Controller('lessons')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly aiService: AiService,
  ) {}

  @Post('ingest')
  async ingestContent(
    @Body() dto: IngestDto,
  ): Promise<ApiResponse<IngestionPreviewResult>> {
    const result = await this.aiService.analyzeAndExtractLesson(dto);
    return {
      code: 200,
      status: true,
      message: 'Phân tích ngữ liệu và hình ảnh thành công',
      data: result,
    };
  }

  @Get('pin/:code')
  async getLessonByPin(
    @Param('code') code: string,
  ): Promise<ApiResponse<LessonBundle>> {
    return this.lessonService.getLessonByPinCode(code);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createLesson(
    @Req() req: Request & { user: JwtPayload },
    @Body() dto: CreateLessonDto,
  ): Promise<ApiResponse<LessonBundle>> {
    return this.lessonService.createLessonBundle(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async listUserLessons(
    @Req() req: Request & { user: JwtPayload },
  ): Promise<ApiResponse<LessonBundle[]>> {
    return this.lessonService.listUserLessons(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getLessonDetail(
    @Param('id') id: string,
  ): Promise<ApiResponse<LessonBundle>> {
    const lesson = await this.lessonService.getLessonBundleById(Number(id));
    return {
      code: 200,
      status: true,
      message: 'OK',
      data: lesson,
    };
  }
}
