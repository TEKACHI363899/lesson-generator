"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
let AiService = AiService_1 = class AiService {
    constructor() {
        this.logger = new common_1.Logger(AiService_1.name);
    }
    async analyzeAndExtractLesson(dto) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey && apiKey.trim().length > 10) {
            try {
                return await this.callGeminiVisionExtraction(dto, apiKey);
            }
            catch (err) {
                this.logger.warn(`Gemini API call failed, falling back to pedagogical extraction engine: ${err instanceof Error ? err.message : String(err)}`);
            }
        }
        return this.generateDeterministicLesson(dto);
    }
    async callGeminiVisionExtraction(dto, apiKey) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const systemPrompt = `You are an expert English curriculum designer and linguist for students aged 7-15.
Analyze the user prompt and textbook screenshots.
Extract vocabulary terms with exact syllable breakdown and primary stress mark.
Extract interactive grammar practice exercises.
Return ONLY valid JSON matching this schema:
{
  "title": string,
  "targetGrade": number,
  "topic": string,
  "durationMinutes": number,
  "vocabularyList": [
    {
      "word": string,
      "vietnameseMeaning": string,
      "partOfSpeech": string,
      "ipa": string,
      "syllables": [{"text": string, "isStress": boolean}],
      "exampleSentence": string,
      "exampleTranslation": string,
      "orderIndex": number
    }
  ],
  "suggestedExercises": [
    {
      "exerciseType": "MULTIPLE_CHOICE" | "FILL_BLANK" | "SENTENCE_SCRAMBLE" | "WORD_MATCH",
      "question": string,
      "options": string[],
      "correctAnswer": string,
      "explanation": string,
      "slideOrder": number
    }
  ]
}`;
        const parts = [
            {
                text: `${systemPrompt}\n\nTask parameters: Grade ${dto.targetGrade}, Topic: "${dto.topic}". User prompt: "${dto.promptText ?? ''}"`,
            },
        ];
        if (dto.imageBase64List && dto.imageBase64List.length > 0) {
            for (const base64Img of dto.imageBase64List) {
                const cleanBase64 = base64Img.replace(/^data:image\/[a-z]+;base64,/, '');
                parts.push({
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: cleanBase64,
                    },
                });
            }
        }
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                    responseMimeType: 'application/json',
                    temperature: 0.2,
                },
            }),
        });
        if (!response.ok) {
            throw new Error(`Gemini API returned status ${response.status}: ${await response.text()}`);
        }
        const result = (await response.json());
        const textContent = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textContent) {
            throw new Error('Empty response from Gemini API');
        }
        return JSON.parse(textContent);
    }
    generateDeterministicLesson(dto) {
        const topic = dto.topic?.trim() || 'My Wonderful Neighborhood';
        const grade = dto.targetGrade || 6;
        const sampleBank = {
            default: [
                {
                    word: 'neighbourhood',
                    vietnameseMeaning: 'Khu phố, xóm giềng',
                    partOfSpeech: 'noun',
                    ipa: '/ˈneɪ.bə.hʊd/',
                    syllables: [
                        { text: 'neigh', isStress: true },
                        { text: 'bour', isStress: false },
                        { text: 'hood', isStress: false },
                    ],
                    exampleSentence: 'There are many friendly people in my neighbourhood.',
                    exampleTranslation: 'Có rất nhiều người thân thiện trong khu phố của tôi.',
                    orderIndex: 1,
                },
                {
                    word: 'fantastic',
                    vietnameseMeaning: 'Tuyệt vời, kỳ diệu',
                    partOfSpeech: 'adjective',
                    ipa: '/fænˈtæs.tɪk/',
                    syllables: [
                        { text: 'fan', isStress: false },
                        { text: 'tas', isStress: true },
                        { text: 'tic', isStress: false },
                    ],
                    exampleSentence: 'We had a fantastic victory in the football match yesterday.',
                    exampleTranslation: 'Chúng tôi đã có một chiến thắng tuyệt vời trong trận bóng đá hôm qua.',
                    orderIndex: 2,
                },
                {
                    word: 'convenient',
                    vietnameseMeaning: 'Thuận tiện, tiện lợi',
                    partOfSpeech: 'adjective',
                    ipa: '/kənˈviː.ni.ənt/',
                    syllables: [
                        { text: 'con', isStress: false },
                        { text: 've', isStress: true },
                        { text: 'ni', isStress: false },
                        { text: 'ent', isStress: false },
                    ],
                    exampleSentence: 'The modern supermarket is very convenient for our family.',
                    exampleTranslation: 'Siêu thị hiện đại rất tiện lợi cho gia đình chúng tôi.',
                    orderIndex: 3,
                },
                {
                    word: 'historic',
                    vietnameseMeaning: 'Mang tính lịch sử, cổ kính',
                    partOfSpeech: 'adjective',
                    ipa: '/hɪˈstɒr.ɪk/',
                    syllables: [
                        { text: 'his', isStress: false },
                        { text: 'tor', isStress: true },
                        { text: 'ic', isStress: false },
                    ],
                    exampleSentence: 'Hoi An is one of the most famous historic towns in Vietnam.',
                    exampleTranslation: 'Hội An là một trong những đô thị cổ kính nổi tiếng nhất Việt Nam.',
                    orderIndex: 4,
                },
                {
                    word: 'multiple',
                    vietnameseMeaning: 'Nhiều, bội số, đa dạng',
                    partOfSpeech: 'adjective',
                    ipa: '/ˈmʌl.tɪ.pəl/',
                    syllables: [
                        { text: 'mul', isStress: true },
                        { text: 'ti', isStress: false },
                        { text: 'ple', isStress: false },
                    ],
                    exampleSentence: 'The football coach has multiple tactical options for the penalty shootout.',
                    exampleTranslation: 'Huấn luyện viên bóng đá có nhiều phương án chiến thuật cho loạt sút luân lưu.',
                    orderIndex: 5,
                },
            ],
        };
        const vocabularyList = sampleBank.default;
        const suggestedExercises = [
            {
                exerciseType: 'MULTIPLE_CHOICE',
                question: 'Living in a big city is very _______ because there are many shops nearby.',
                options: ['convenient', 'noisy', 'historic', 'narrow'],
                correctAnswer: 'convenient',
                explanation: 'Tính từ "convenient" (tiện lợi) phù hợp với ngữ cảnh có nhiều cửa hàng ở gần.',
                slideOrder: 1,
            },
            {
                exerciseType: 'FILL_BLANK',
                question: 'Hoi An Ancient Town has many _______ buildings built hundreds of years ago.',
                options: [],
                correctAnswer: 'historic',
                explanation: 'Điền từ "historic" (mang tính lịch sử/cổ kính) để miêu tả các tòa nhà hàng trăm năm tuổi.',
                slideOrder: 2,
            },
            {
                exerciseType: 'SENTENCE_SCRAMBLE',
                question: 'is / our / friendly / very / neighbourhood / .',
                options: ['Our', 'neighbourhood', 'is', 'very', 'friendly.'],
                correctAnswer: 'Our neighbourhood is very friendly.',
                explanation: 'Cấu trúc câu khẳng định chuẩn: Chủ ngữ (Our neighbourhood) + To be (is) + Trạng từ chỉ mức độ (very) + Tính từ (friendly).',
                slideOrder: 3,
            },
        ];
        return {
            title: `Unit: ${topic} - Grade ${grade}`,
            targetGrade: grade,
            topic,
            durationMinutes: dto.durationMinutes || 45,
            vocabularyList,
            suggestedExercises,
        };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)()
], AiService);
//# sourceMappingURL=ai.service.js.map