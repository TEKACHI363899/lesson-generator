import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@eng-studio/shared-types';

@Controller()
export class AppController {
  @Get('health')
  getHealth(): ApiResponse<{ status: string; uptime: number }> {
    return {
      code: 200,
      status: true,
      message: 'English Gamified Lesson Studio API is healthy',
      data: {
        status: 'UP',
        uptime: process.uptime(),
      },
    };
  }
}
