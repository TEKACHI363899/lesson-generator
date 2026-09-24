import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Request } from 'express';
import { createHash } from 'crypto';
import { NguoiDungThietBiEntity } from '../../database/entities/nguoi-dung-thiet-bi.entity';
import { JwtPayload } from '@eng-studio/shared-types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(NguoiDungThietBiEntity)
    private readonly deviceSessionRepo: Repository<NguoiDungThietBiEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? 'super_secret_jwt_key_eng_studio_min_32_chars',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
    const rawToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const headerDeviceId = req.headers['x-device-id'] as string | undefined;

    if (!rawToken) {
      throw new UnauthorizedException('TOKEN_MISSING');
    }

    if (!headerDeviceId || headerDeviceId !== payload.deviceId) {
      throw new UnauthorizedException('DEVICE_ID_MISMATCH');
    }

    const hashedToken = createHash('sha256').update(rawToken).digest('hex');

    const activeSession = await this.deviceSessionRepo.findOne({
      where: {
        nguoiDungId: payload.sub,
        deviceId: payload.deviceId,
        jwtToken: hashedToken,
        hoatDong: true,
        hetHanLuc: MoreThan(new Date()),
      },
    });

    if (!activeSession) {
      throw new UnauthorizedException('SESSION_EXPIRED_OR_REVOKED');
    }

    return payload;
  }
}
