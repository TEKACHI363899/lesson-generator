import React, { useState } from 'react';
import {
  BookOpen,
  KeyRound,
  Gamepad2,
  ListChecks,
  PlusCircle,
  LogIn,
  LogOut,
  User,
  MonitorPlay,
} from 'lucide-react';
import { useLessonStore } from '../../stores/lessonStore';
import { useAuthStore } from '../../stores/authStore';

interface NavbarProps {
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLoginModal }) => {
  const [pinInput, setPinInput] = useState('');
  const { activeLesson, viewMode, setViewMode, loadLessonByPin, resetAll } = useLessonStore();
  const { user, logout } = useAuthStore();

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim()) {
      void loadLessonByPin(pinInput);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 py-3 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={resetAll}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">
              English Lesson Studio
            </span>
            <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase block">
              Clean Academic
            </span>
          </div>
        </div>

        {/* Quick Lesson PIN Box */}
        <form onSubmit={handlePinSubmit} className="hidden sm:flex items-center gap-2">
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.toUpperCase())}
              placeholder="MA PIN (VD: ENG-8492)"
              maxLength={12}
              className="w-48 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs font-mono font-bold uppercase text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
          >
            Mở bài
          </button>
        </form>

        {/* Navigation Tabs (Available when a lesson is loaded) */}
        {activeLesson && (
          <nav className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('PRESENTATION')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'PRESENTATION'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MonitorPlay className="h-3.5 w-3.5" />
              <span>Slide bài giảng</span>
            </button>

            <button
              onClick={() => setViewMode('GAMES')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'GAMES'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gamepad2 className="h-3.5 w-3.5" />
              <span>Trò chơi hành động</span>
            </button>

            <button
              onClick={() => setViewMode('EXERCISES')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'EXERCISES'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListChecks className="h-3.5 w-3.5" />
              <span>Bài tập tương tác</span>
            </button>
          </nav>
        )}

        {/* Action Controls & Auth */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setViewMode('INGESTION')}
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Tạo bài mới</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-semibold">{user.fullName}</span>
              </div>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
            >
              <LogIn className="h-4 w-4 text-slate-500" />
              <span>Đăng nhập giáo viên</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
