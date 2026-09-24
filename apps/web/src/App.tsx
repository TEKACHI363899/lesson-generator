import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { StateBoundary } from './components/common/StateBoundary';
import { LessonIngestionModal } from './components/ingestion/LessonIngestionModal';
import { VocabularyReviewStep } from './components/review/VocabularyReviewStep';
import { CleanAcademicPresentation } from './components/presentation/CleanAcademicPresentation';
import { ActionGameContainer } from './components/games/ActionGameContainer';
import { InteractiveExerciseView } from './components/exercises/InteractiveExerciseView';
import { AuthModal } from './components/common/AuthModal';
import { useLessonStore } from './stores/lessonStore';

export const App: React.FC = () => {
  const { viewMode, isLoading, error, activeLesson } = useLessonStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onOpenLoginModal={() => setIsAuthModalOpen(true)} />

      <main className="flex-1">
        {viewMode === 'INGESTION' && <LessonIngestionModal />}

        {viewMode === 'REVIEW' && <VocabularyReviewStep />}

        {viewMode === 'PRESENTATION' && (
          <StateBoundary
            isLoading={isLoading}
            error={error}
            data={activeLesson}
            emptyTitle="Chưa có bài giảng nào được tải"
            emptyDescription="Hãy nhập mã PIN ở thanh điều hướng trên cùng hoặc tạo bài mới để bắt đầu bài giảng."
          >
            {() => <CleanAcademicPresentation />}
          </StateBoundary>
        )}

        {viewMode === 'GAMES' && (
          <StateBoundary
            isLoading={isLoading}
            error={error}
            data={activeLesson}
            emptyTitle="Chưa có trò chơi nào sẵn sàng"
            emptyDescription="Hãy chọn hoặc tạo một bài giảng để khởi động các mini-game sút bóng, đua xe, săn rương và đấu boss."
          >
            {() => <ActionGameContainer />}
          </StateBoundary>
        )}

        {viewMode === 'EXERCISES' && (
          <StateBoundary
            isLoading={isLoading}
            error={error}
            data={activeLesson}
            emptyTitle="Chưa có bài tập nào"
            emptyDescription="Hãy tạo hoặc mở bài giảng để xem các bài tập ngữ pháp và trắc nghiệm thực hành."
          >
            {() => <InteractiveExerciseView />}
          </StateBoundary>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
