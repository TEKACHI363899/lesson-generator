import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { LoginDto, RegisterDto } from './dto/login.dto';
import { ApiResponse, UserSession } from '@eng-studio/shared-types';
export declare class AuthService {
    private readonly dataSource;
    private readonly jwtService;
    private readonly logger;
    constructor(dataSource: DataSource, jwtService: JwtService);
    register(dto: RegisterDto): Promise<ApiResponse<UserSession>>;
    login(dto: LoginDto): Promise<ApiResponse<UserSession>>;
    logout(userId: number, deviceId: string): Promise<ApiResponse<null>>;
}
