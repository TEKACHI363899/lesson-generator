import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { NguoiDungEntity } from '../../database/entities/nguoi-dung.entity';
import { NguoiDungThietBiEntity } from '../../database/entities/nguoi-dung-thiet-bi.entity';
import { LoginDto, RegisterDto } from './dto/login.dto';
import { ApiResponse, UserSession, JwtPayload, UserRole } from '@eng-studio/shared-types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<ApiResponse<UserSession>> {
    const userRepo = this.dataSource.getRepository(NguoiDungEntity);
    const existing = await userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = queryRunner.manager.create(NguoiDungEntity, {
        email: dto.email,
        matKhauHash: passwordHash,
        hoTen: dto.fullName,
        vaiTro: 'TEACHER',
        trangThai: 1,
      });

      const savedUser = await queryRunner.manager.save(NguoiDungEntity, newUser);

      const payload: JwtPayload = {
        sub: savedUser.id,
        email: savedUser.email,
        role: savedUser.vaiTro as UserRole,
        deviceId: dto.deviceId,
      };

      const token = this.jwtService.sign(payload);
      const hashedToken = createHash('sha256').update(token).digest('hex');
      const expiresAt = new Date(Date.now() + 86400 * 1000); // 24 hours

      const deviceSession = queryRunner.manager.create(NguoiDungThietBiEntity, {
        nguoiDungId: savedUser.id,
        deviceId: dto.deviceId,
        jwtToken: hashedToken,
        hetHanLuc: expiresAt,
        hoatDong: true,
      });
      await queryRunner.manager.save(NguoiDungThietBiEntity, deviceSession);

      await queryRunner.commitTransaction();

      return {
        code: 201,
        status: true,
        message: 'Đăng ký tài khoản thành công',
        data: {
          id: savedUser.id,
          email: savedUser.email,
          fullName: savedUser.hoTen,
          role: savedUser.vaiTro as UserRole,
          token,
          deviceId: dto.deviceId,
        },
      };
    } catch (err: unknown) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Register Transaction Error: ${err instanceof Error ? err.message : String(err)}`);
      throw new BadRequestException('Không thể đăng ký tài khoản');
    } finally {
      await queryRunner.release();
    }
  }

  async login(dto: LoginDto): Promise<ApiResponse<UserSession>> {
    const userRepo = this.dataSource.getRepository(NguoiDungEntity);
    const user = await userRepo.findOne({ where: { email: dto.email, trangThai: 1 } });

    if (!user || !(await bcrypt.compare(dto.password, user.matKhauHash))) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.vaiTro as UserRole,
      deviceId: dto.deviceId,
    };

    const token = this.jwtService.sign(payload);
    const hashedToken = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 86400 * 1000); // 24 hours

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Invalidate any previous session for this device
      await queryRunner.manager.update(
        NguoiDungThietBiEntity,
        { nguoiDungId: user.id, deviceId: dto.deviceId, hoatDong: true },
        { hoatDong: false },
      );

      // Record active device session
      const deviceSession = queryRunner.manager.create(NguoiDungThietBiEntity, {
        nguoiDungId: user.id,
        deviceId: dto.deviceId,
        jwtToken: hashedToken,
        hetHanLuc: expiresAt,
        hoatDong: true,
      });
      await queryRunner.manager.save(NguoiDungThietBiEntity, deviceSession);

      await queryRunner.commitTransaction();

      return {
        code: 200,
        status: true,
        message: 'Đăng nhập thành công',
        data: {
          id: user.id,
          email: user.email,
          fullName: user.hoTen,
          role: user.vaiTro as UserRole,
          token,
          deviceId: dto.deviceId,
        },
      };
    } catch (err: unknown) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Login Transaction Error: ${err instanceof Error ? err.message : String(err)}`);
      throw new BadRequestException('Lỗi trong quá trình xác thực thiết bị');
    } finally {
      await queryRunner.release();
    }
  }

  async logout(userId: number, deviceId: string): Promise<ApiResponse<null>> {
    const deviceRepo = this.dataSource.getRepository(NguoiDungThietBiEntity);
    await deviceRepo.update(
      { nguoiDungId: userId, deviceId, hoatDong: true },
      { hoatDong: false },
    );

    return {
      code: 200,
      status: true,
      message: 'Đăng xuất thành công',
      data: null,
    };
  }
}
