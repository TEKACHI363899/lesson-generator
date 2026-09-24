import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { NguoiDungEntity } from '../../database/entities/nguoi-dung.entity';
import { NguoiDungThietBiEntity } from '../../database/entities/nguoi-dung-thiet-bi.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NguoiDungEntity, NguoiDungThietBiEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'super_secret_jwt_key_eng_studio_min_32_chars',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
