import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/login.dto';
import { ApiResponse, UserSession, JwtPayload } from '@eng-studio/shared-types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<ApiResponse<UserSession>>;
    login(dto: LoginDto): Promise<ApiResponse<UserSession>>;
    logout(req: Request & {
        user: JwtPayload;
    }, deviceId: string): Promise<ApiResponse<null>>;
}
