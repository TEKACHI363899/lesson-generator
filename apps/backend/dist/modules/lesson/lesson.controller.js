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
exports.LessonController = void 0;
const common_1 = require("@nestjs/common");
const lesson_service_1 = require("./lesson.service");
const ai_service_1 = require("../ai/ai.service");
const create_lesson_dto_1 = require("./dto/create-lesson.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let LessonController = class LessonController {
    constructor(lessonService, aiService) {
        this.lessonService = lessonService;
        this.aiService = aiService;
    }
    async ingestContent(dto) {
        const result = await this.aiService.analyzeAndExtractLesson(dto);
        return {
            code: 200,
            status: true,
            message: 'Phân tích ngữ liệu và hình ảnh thành công',
            data: result,
        };
    }
    async getLessonByPin(code) {
        return this.lessonService.getLessonByPinCode(code);
    }
    async createLesson(req, dto) {
        return this.lessonService.createLessonBundle(req.user.sub, dto);
    }
    async listUserLessons(req) {
        return this.lessonService.listUserLessons(req.user.sub);
    }
    async getLessonDetail(id) {
        const lesson = await this.lessonService.getLessonBundleById(Number(id));
        return {
            code: 200,
            status: true,
            message: 'OK',
            data: lesson,
        };
    }
};
exports.LessonController = LessonController;
__decorate([
    (0, common_1.Post)('ingest'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lesson_dto_1.IngestDto]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "ingestContent", null);
__decorate([
    (0, common_1.Get)('pin/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "getLessonByPin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_lesson_dto_1.CreateLessonDto]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "createLesson", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "listUserLessons", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "getLessonDetail", null);
exports.LessonController = LessonController = __decorate([
    (0, common_1.Controller)('lessons'),
    __metadata("design:paramtypes", [lesson_service_1.LessonService,
        ai_service_1.AiService])
], LessonController);
//# sourceMappingURL=lesson.controller.js.map