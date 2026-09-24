import React, { useState } from 'react';
import {
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useLessonStore } from '../../stores/lessonStore';
import {
  VocabularyItem,
  CreateLessonDto,
  ActionGameConfig,
  InteractiveExercise,
  SyllableSegment,
} from '@eng-studio/shared-types';

export const VocabularyReviewStep: React.FC = () => {
  const { ingestionPreview, saveFullLesson, setViewMode, isLoading } = useLessonStore();

  const [vocabList, setVocabList] = useState<VocabularyItem[]>(
    ingestionPreview?.vocabularyList ? [...ingestionPreview.vocabularyList] : [],
  );

  if (!ingestionPreview) {
    return null;
  }

  const handleWordChange = (index: number, field: keyof VocabularyItem, value: unknown) => {
    setVocabList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const toggleStress = (wordIndex: number, sylIndex: number) => {
    setVocabList((prev) => {
      const updated = [...prev];
      const syllables = [...updated[wordIndex].syllables];
      const newSyllables = syllables.map((s, idx) => ({
        ...s,
        isStress: idx === sylIndex,
      }));
      updated[wordIndex] = {
        ...updated[wordIndex],
        syllables: newSyllables,
      };
      return updated;
    });
  };

  const addWord = () => {
    const newWord: VocabularyItem = {
      word: 'celebrate',
      vietnameseMeaning: 'Ăn mừng, kỷ niệm',
      partOfSpeech: 'verb',
      ipa: '/ˈsel.ə.breɪt/',
      syllables: [
        { text: 'cel', isStress: true },
        { text: 'e', isStress: false },
        { text: 'brate', isStress: false },
      ],
      exampleSentence: 'The team will celebrate after scoring the winning penalty goal.',
      exampleTranslation: 'Cả đội sẽ ăn mừng sau khi ghi bàn thắng quyết định từ chấm phạt đền.',
      orderIndex: vocabList.length + 1,
    };
    setVocabList((prev) => [...prev, newWord]);
  };

  const removeWord = (index: number) => {
    setVocabList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleGenerateFullLesson = async () => {
    const games: ActionGameConfig[] = [
      {
        gameType: 'PENALTY_SHOOTOUT',
        title: 'Sút bóng Penalty: Chinh phục khung thành',
        matchMode: 'TWO_TEAMS',
        slidePosition: 2,
        questionsData: (ingestionPreview.suggestedExercises as unknown as InteractiveExercise[]) ?? [],
      },
      {
        gameType: 'SPEED_RACING',
        title: 'Đua xe tốc độ: Nitro vượt chướng ngại vật',
        matchMode: 'TWO_TEAMS',
        slidePosition: 3,
        questionsData: (ingestionPreview.suggestedExercises as unknown as InteractiveExercise[]) ?? [],
      },
      {
        gameType: 'GOLD_QUEST',
        title: 'Săn rương kho báu: Đổi điểm kỳ diệu',
        matchMode: 'TWO_TEAMS',
        slidePosition: 4,
        questionsData: (ingestionPreview.suggestedExercises as unknown as InteractiveExercise[]) ?? [],
      },
      {
        gameType: 'BOSS_BATTLE',
        title: 'Đại chiến Quái vật: Hợp lực tung chiêu',
        matchMode: 'CLASS_COOP',
        slidePosition: 5,
        questionsData: (ingestionPreview.suggestedExercises as unknown as InteractiveExercise[]) ?? [],
      },
    ];

    const lessonDto: CreateLessonDto = {
      title: ingestionPreview.title,
      grade: ingestionPreview.targetGrade,
      topic: ingestionPreview.topic,
      durationMinutes: ingestionPreview.durationMinutes,
      presentationConfig: {
        theme: 'CLEAN_ACADEMIC',
        fontScale: 'PRESENTATION_BOARD',
        soundEnabled: true,
      },
      vocabularyList: vocabList,
      games,
      exercises: ingestionPreview.suggestedExercises,
    };

    await saveFullLesson(lessonDto);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Bước 2: Duyệt & Chỉnh sửa Từ vựng - Ngữ pháp</span>
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {ingestionPreview.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Giáo viên có thể chỉnh sửa nghĩa, âm tiết, nhấp vào âm tiết để đổi trọng âm trước khi sinh Slide và Game.
          </p>
        </div>

        <button
          onClick={handleGenerateFullLesson}
          disabled={isLoading || vocabList.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isLoading ? 'Đang tạo bài giảng...' : 'Tạo Bài giảng & Game sút bóng'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Vocabulary Items List */}
      <div className="space-y-4">
        {vocabList.map((item: VocabularyItem, wordIdx: number) => (
          <div
            key={wordIdx}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-slate-300"
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <span className="font-bold text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                Từ vựng #{wordIdx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeWord(wordIdx)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                title="Xóa từ này"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Từ tiếng Anh
                </label>
                <input
                  type="text"
                  value={item.word}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleWordChange(wordIdx, 'word', e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Nghĩa tiếng Việt
                </label>
                <input
                  type="text"
                  value={item.vietnameseMeaning}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleWordChange(wordIdx, 'vietnameseMeaning', e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Từ loại
                </label>
                <input
                  type="text"
                  value={item.partOfSpeech}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleWordChange(wordIdx, 'partOfSpeech', e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Phiên âm IPA
                </label>
                <input
                  type="text"
                  value={item.ipa}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleWordChange(wordIdx, 'ipa', e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Interactive Syllable and Stress Editor */}
            <div className="mb-4 bg-slate-50/80 rounded-xl p-3 border border-slate-200">
              <span className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
                Phân tách âm tiết & Trọng âm (Nhấp vào âm tiết để đổi trọng âm chính):
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {item.syllables.map((syl: SyllableSegment, sylIdx: number) => (
                  <button
                    key={sylIdx}
                    type="button"
                    onClick={() => toggleStress(wordIdx, sylIdx)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-mono font-bold transition-all cursor-pointer ${
                      syl.isStress
                        ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{syl.text}</span>
                    {syl.isStress && (
                      <span className="ml-1 text-[10px] bg-indigo-800 text-amber-300 px-1 py-0.5 rounded">
                        STRESS
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sentence Examples */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Câu ví dụ tiếng Anh
                </label>
                <input
                  type="text"
                  value={item.exampleSentence}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleWordChange(wordIdx, 'exampleSentence', e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Dịch nghĩa câu
                </label>
                <input
                  type="text"
                  value={item.exampleTranslation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleWordChange(wordIdx, 'exampleTranslation', e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Word Button */}
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={addWord}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm từ vựng mới</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('INGESTION')}
          className="text-xs text-slate-500 hover:text-slate-800 underline"
        >
          Quay lại chỉnh sửa prompt / ảnh
        </button>
      </div>
    </div>
  );
};
