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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsController = void 0;
const common_1 = require("@nestjs/common");
let OptionsController = class OptionsController {
    getOptions() {
        const data = {
            grades: [
                { label: 'Grade 2 (Age 7)', value: 2 },
                { label: 'Grade 3 (Age 8)', value: 3 },
                { label: 'Grade 4 (Age 9)', value: 4 },
                { label: 'Grade 5 (Age 10)', value: 5 },
                { label: 'Grade 6 (Age 11)', value: 6 },
                { label: 'Grade 7 (Age 12)', value: 7 },
                { label: 'Grade 8 (Age 13)', value: 8 },
                { label: 'Grade 9 (Age 14-15)', value: 9 },
            ],
            gameEngines: [
                {
                    label: 'Penalty Shootout',
                    value: 'PENALTY_SHOOTOUT',
                    description: '5-spot precision target penalty shootout with goalkeeper dive and crowd cheer',
                },
                {
                    label: 'Speed Turbo Racing',
                    value: 'SPEED_RACING',
                    description: 'Top-down highway race with nitro booster on correct answers',
                },
                {
                    label: 'Gold Quest',
                    value: 'GOLD_QUEST',
                    description: 'Treasure chest grid with points, multipliers, swaps and traps',
                },
                {
                    label: 'Boss Monster Battle',
                    value: 'BOSS_BATTLE',
                    description: 'Team cooperative battle against an infernal boss with spell VFX',
                },
            ],
            exerciseTypes: [
                { label: 'Multiple Choice Question', value: 'MULTIPLE_CHOICE' },
                { label: 'Fill in the Blank', value: 'FILL_BLANK' },
                { label: 'Sentence Word Scramble', value: 'SENTENCE_SCRAMBLE' },
                { label: 'Word and Definition Matching', value: 'WORD_MATCH' },
            ],
        };
        return {
            code: 200,
            status: true,
            message: 'OK',
            data,
        };
    }
};
exports.OptionsController = OptionsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], OptionsController.prototype, "getOptions", null);
exports.OptionsController = OptionsController = __decorate([
    (0, common_1.Controller)('options')
], OptionsController);
//# sourceMappingURL=options.controller.js.map