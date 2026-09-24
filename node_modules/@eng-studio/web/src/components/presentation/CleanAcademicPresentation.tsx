import React, { useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Gamepad2,
  ListChecks,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import { useLessonStore } from '../../stores/lessonStore';
import { HoverSyllableWord } from './HoverSyllableWord';

export const CleanAcademicPresentation: React.FC = () => {
  const {
    activeLesson,
    currentSlideIndex,
    setCurrentSlideIndex,
    nextSlide,
    prevSlide,
    setViewMode,
  } = useLessonStore();

  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        void document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  // Keyboard navigation for teachers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, toggleFullscreen]);

  if (!activeLesson || activeLesson.vocabularyList.length === 0) {
    return null;
  }

  const vocabList = activeLesson.vocabularyList;
  const currentVocab = vocabList[currentSlideIndex] ?? vocabList[0];
  const progressPercent = ((currentSlideIndex + 1) / vocabList.length) * 100;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] max-w-6xl mx-auto px-4 py-6">
      {/* Presentation Top Status Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-1 font-mono text-xs font-bold text-indigo-700">
            {activeLesson.lessonCode}
          </span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {activeLesson.title}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            (Lớp {activeLesson.grade} - {activeLesson.topic})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct CTA to Jump into Action Games after Vocab */}
          <button
            onClick={() => setViewMode('GAMES')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <Gamepad2 className="h-4 w-4" />
            <span>Vào trò chơi sút bóng</span>
          </button>

          <button
            onClick={() => setViewMode('EXERCISES')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ListChecks className="h-4 w-4 text-slate-500" />
            <span>Bài tập</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toàn màn hình (phím F)"
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Slide Stage (Optimized for 10-meter Classroom Visibility) */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 md:p-14 shadow-sm transition-all duration-200">
          {/* Card Header Metadata */}
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                {currentVocab.partOfSpeech}
              </span>
              <span className="font-mono text-base font-medium text-slate-500">
                {currentVocab.ipa}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Layers className="h-4 w-4" />
              <span>
                Từ vựng {currentSlideIndex + 1} / {vocabList.length}
              </span>
            </div>
          </div>

          {/* Interactive Word Display (Hover to trigger Syllable Breakdown & Stress) */}
          <div className="text-center py-6">
            <div className="text-6xl md:text-7xl font-bold tracking-tight mb-2">
              <HoverSyllableWord
                word={currentVocab.word}
                syllables={currentVocab.syllables}
                ipa={currentVocab.ipa}
              />
            </div>
            <p className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Di chuột lên từ để xem phân rã từng âm tiết và vị trí trọng âm</span>
            </p>
          </div>

          {/* Meaning Block */}
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-semibold text-slate-800">
              {currentVocab.vietnameseMeaning}
            </h3>
          </div>

          {/* Contextual Sentence Block */}
          <div className="rounded-2xl bg-slate-50 border-l-4 border-indigo-600 p-6">
            <p className="text-xl md:text-2xl font-semibold text-slate-800 mb-1 leading-snug">
              {currentVocab.exampleSentence}
            </p>
            <p className="text-base font-normal text-slate-500">
              {currentVocab.exampleTranslation}
            </p>
          </div>
        </div>
      </div>

      {/* Presentation Bottom Navigation Controls */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          disabled={currentSlideIndex === 0}
          onClick={prevSlide}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Từ trước (Phím Mũi tên Trái)</span>
        </button>

        {/* Thumbnail Selector Dots */}
        <div className="hidden sm:flex items-center gap-2">
          {vocabList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-3 rounded-full transition-all duration-200 ${
                idx === currentSlideIndex
                  ? 'w-8 bg-indigo-600'
                  : 'w-3 bg-slate-200 hover:bg-slate-300'
              }`}
              title={`Chuyển tới từ số ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={currentSlideIndex === vocabList.length - 1}
          onClick={nextSlide}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <span>Từ tiếp theo (Phím Space / Phải)</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Classroom Pedagogical Tip */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <Info className="h-3.5 w-3.5" />
        <span>
          Mẹo lớp học: Sau khi dạy hết danh sách từ, hãy nhấn "Vào trò chơi sút bóng" để cả lớp thi đua ghi nhớ trước khi làm bài tập.
        </span>
      </div>
    </div>
  );
};
