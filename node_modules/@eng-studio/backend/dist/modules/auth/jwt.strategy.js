"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const nguoi_dung_thiet_bi_entity_1 = require("../../database/entities/nguoi-dung-thiet-bi.entity");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(deviceSessionRepo) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET ?? 'super_secret_jwt_key_eng_studio_min_32_chars',
            passReqToCallback: true,
        });
        this.deviceSessionRepo = deviceSessionRepo;
    }
    async validate(req, payload) {
        const rawToken = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        const headerDeviceId = req.headers['x-device-id'];
        if (!rawToken) {
            throw new common_1.UnauthorizedException('TOKEN_MISSING');
        }
        if (!headerDeviceId || headerDeviceId !== payload.deviceId) {
            throw new common_1.UnauthorizedException('DEVICE_ID_MISMATCH');
        }
        const hashedToken = (0, crypto_1.createHash)('sha256').update(rawToken).digest('hex');
        const activeSession = await this.deviceSessionRepo.findOne({
            where: {
                nguoiDungId: payload.sub,
                deviceId: payload.deviceId,
                jwtToken: hashedToken,
                hoatDong: true,
                hetHanLuc: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
        if (!activeSession) {
            throw new common_1.UnauthorizedException('SESSION_EXPIRED_OR_REVOKED');
        }
        return payload;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(nguoi_dung_thiet_bi_entity_1.NguoiDungThietBiEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map