"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const nguoi_dung_entity_1 = require("../../database/entities/nguoi-dung.entity");
const nguoi_dung_thiet_bi_entity_1 = require("../../database/entities/nguoi-dung-thiet-bi.entity");
let AuthService = AuthService_1 = class AuthService {
    constructor(dataSource, jwtService) {
        this.dataSource = dataSource;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const userRepo = this.dataSource.getRepository(nguoi_dung_entity_1.NguoiDungEntity);
        const existing = await userRepo.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.BadRequestException('Email đã được sử dụng');
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(dto.password, saltRounds);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const newUser = queryRunner.manager.create(nguoi_dung_entity_1.NguoiDungEntity, {
                email: dto.email,
                matKhauHash: passwordHash,
                hoTen: dto.fullName,
                vaiTro: 'TEACHER',
                trangThai: 1,
            });
            const savedUser = await queryRunner.manager.save(nguoi_dung_entity_1.NguoiDungEntity, newUser);
            const payload = {
                sub: savedUser.id,
                email: savedUser.email,
                role: savedUser.vaiTro,
                deviceId: dto.deviceId,
            };
            const token = this.jwtService.sign(payload);
            const hashedToken = (0, crypto_1.createHash)('sha256').update(token).digest('hex');
            const expiresAt = new Date(Date.now() + 86400 * 1000);
            const deviceSession = queryRunner.manager.create(nguoi_dung_thiet_bi_entity_1.NguoiDungThietBiEntity, {
                nguoiDungId: savedUser.id,
                deviceId: dto.deviceId,
                jwtToken: hashedToken,
                hetHanLuc: expiresAt,
                hoatDong: true,
            });
            await queryRunner.manager.save(nguoi_dung_thiet_bi_entity_1.NguoiDungThietBiEntity, deviceSession);
            await queryRunner.commitTransaction();
            return {
                code: 201,
                status: true,
                message: 'Đăng ký tài khoản thành công',
                data: {
                    id: savedUser.id,
                    email: savedUser.email,
                    fullName: savedUser.hoTen,
                    role: savedUser.vaiTro,
                    token,
                    deviceId: dto.deviceId,
                },
            };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Register Transaction Error: ${err instanceof Error ? err.message : String(err)}`);
            throw new common_1.BadRequestException('Không thể đăng ký tài khoản');
        }
        finally {
            await queryRunner.release();
        }
    }
    async login(dto) {
        const userRepo = this.dataSource.getRepository(nguoi_dung_entity_1.NguoiDungEntity);
        const user = await userRepo.findOne({ where: { email: dto.email, trangThai: 1 } });
        if (!user || !(await bcrypt.compare(dto.password, user.matKhauHash))) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.vaiTro,
            deviceId: dto.deviceId,
        };
        const token = this.jwtService.sign(payload);
        const hashedToken = (0, crypto_1.createHash)('sha256').update(token).digest('hex');
        const expiresAt = new Date(Date.now() + 86400 * 1000);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(nguoi_dung_thiet_bi_entity_1.NguoiDungThietBiEntity, { nguoiDungId: user.id, deviceId: dto.deviceId, hoatDong: true }, { hoatDong: false });
            const deviceSession = queryRunner.manager.create(nguoi_dung_thiet_bi_entity_1.NguoiDungThietBiEntity, {
                nguoiDungId: user.id,
                deviceId: dto.deviceId,
                jwtToken: hashedToken,
                hetHanLuc: expiresAt,
                hoatDong: true,
            });
            await queryRunner.manager.save(nguoi_dung_thiet_bi_entity_1.NguoiDungThietBiEntity, deviceSession);
            await queryRunner.commitTransaction();
            return {
                code: 200,
                status: true,
                message: 'Đăng nhập thành công',
                data: {
                    id: user.id,
                    email: user.email,
                    fullName: user.hoTen,
                    role: user.vaiTro,
                    token,
                    deviceId: dto.deviceId,
                },
            };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Login Transaction Error: ${err instanceof Error ? err.message : String(err)}`);
            throw new common_1.BadRequestException('Lỗi trong quá trình xác thực thiết bị');
        }
        finally {
            await queryRunner.release();
        }
    }
    async logout(userId, deviceId) {
        const deviceRepo = this.dataSource.getRepository(nguoi_dung_thiet_bi_entity_1.NguoiDungThietBiEntity);
        await deviceRepo.update({ nguoiDungId: userId, deviceId, hoatDong: true }, { hoatDong: false });
        return {
            code: 200,
            status: true,
            message: 'Đăng xuất thành công',
            data: null,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map