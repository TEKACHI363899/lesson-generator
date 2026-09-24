import { Controller, Post, Body, UseGuards, Req, Headers } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiResponse, UserSession, JwtPayload } from '@eng-studio/shared-types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<ApiResponse<UserSession>> {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<ApiResponse<UserSession>> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Req() req: Request & { user: JwtPayload },
    @Headers('x-device-id') deviceId: string,
  ): Promise<ApiResponse<null>> {
    return this.authService.logout(req.user.sub, deviceId);
  }
}
