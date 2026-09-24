import React, { useState } from 'react';
import {
  ListChecks,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Gamepad2,
} from 'lucide-react';
import { useLessonStore } from '../../stores/lessonStore';
import { InteractiveExercise } from '@eng-studio/shared-types';

export const InteractiveExerciseView: React.FC = () => {
  const { activeLesson, setViewMode } = useLessonStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [fillBlankInput, setFillBlankInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const exercises: readonly InteractiveExercise[] =
    activeLesson && activeLesson.exercises.length > 0
      ? activeLesson.exercises
      : [];

  if (exercises.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-slate-500 text-sm">Chưa có bài tập cho bài học này.</p>
      </div>
    );
  }

  const currentEx = exercises[currentIndex];
  const isLast = currentIndex === exercises.length - 1;

  const handleSelectOption = (opt: string) => {
    if (showAnswer) return;
    setSelectedAnswer(opt);
    setShowAnswer(true);
    setAnsweredCount((prev) => prev + 1);

    if (opt.trim().toLowerCase() === currentEx.correctAnswer.trim().toLowerCase()) {
      setScore((prev) => prev + 1);
    }
  };

  const handleFillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showAnswer || !fillBlankInput.trim()) return;
    setShowAnswer(true);
    setAnsweredCount((prev) => prev + 1);

    if (fillBlankInput.trim().toLowerCase() === currentEx.correctAnswer.trim().toLowerCase()) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setFillBlankInput('');
      setShowAnswer(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setFillBlankInput('');
    setShowAnswer(false);
    setScore(0);
    setAnsweredCount(0);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <ListChecks className="h-3.5 w-3.5" />
            <span>Thực hành củng cố (Practice)</span>
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Bài tập #{currentIndex + 1} / {exercises.length}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700">
            Điểm: {score} / {answeredCount}
          </div>
          <button
            onClick={() => setViewMode('GAMES')}
            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>Vào chơi Game</span>
          </button>
        </div>
      </div>

      {/* Main Exercise Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
        <div className="mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            {currentEx.exerciseType === 'MULTIPLE_CHOICE'
              ? 'Trắc nghiệm chọn từ đúng'
              : currentEx.exerciseType === 'FILL_BLANK'
              ? 'Điền từ khuyết'
              : currentEx.exerciseType === 'SENTENCE_SCRAMBLE'
              ? 'Sắp xếp câu hoàn chỉnh'
              : 'Nối từ'}
          </span>
        </div>

        {/* Question Statement */}
        <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-8 leading-snug">
          {currentEx.question}
        </h3>

        {/* Multiple Choice Options */}
        {currentEx.exerciseType === 'MULTIPLE_CHOICE' && currentEx.options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentEx.options.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              const isCorrectAnswer =
                opt.trim().toLowerCase() === currentEx.correctAnswer.trim().toLowerCase();

              let btnStyle =
                'bg-slate-50 border-slate-200 text-slate-800 hover:bg-indigo-50 hover:border-indigo-300';
              if (showAnswer) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-600 text-white border-rose-600 font-bold';
                } else {
                  btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={showAnswer}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border text-base font-semibold text-left transition-all cursor-pointer ${btnStyle}`}
                >
                  <span className="font-mono text-xs opacity-70 mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Fill in the Blank Input */}
        {currentEx.exerciseType !== 'MULTIPLE_CHOICE' && (
          <form onSubmit={handleFillSubmit} className="mb-6 flex gap-3">
            <input
              type="text"
              value={fillBlankInput}
              disabled={showAnswer}
              onChange={(e) => setFillBlankInput(e.target.value)}
              placeholder="Nhập câu trả lời của bạn..."
              className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            {!showAnswer && (
              <button
                type="submit"
                className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
              >
                Kiểm tra
              </button>
            )}
          </form>
        )}

        {/* Answer & Grammar Explanation Reveal */}
        {showAnswer && (
          <div className="rounded-2xl bg-slate-50 border-l-4 border-emerald-500 p-6 mt-6 transition-all">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Đáp án chính xác: {currentEx.correctAnswer}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-bold">Giải thích ngữ pháp:</span> {currentEx.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Làm lại từ đầu</span>
        </button>

        {showAnswer && !isLast && (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <span>Câu tiếp theo</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
