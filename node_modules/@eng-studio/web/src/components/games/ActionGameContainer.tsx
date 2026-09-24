import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  RefreshCw,
  Trophy,
  Users,
  User,
  Zap,
  CheckCircle,
  XCircle,
  HelpCircle,
  Flame,
  Award,
} from 'lucide-react';
import { globalClassroomAudio } from '../../engines/ClassroomAudioEngine';
import { PenaltyShootoutEngine } from '../../engines/PenaltyShootoutEngine';
import { SpeedTurboRacingEngine } from '../../engines/SpeedTurboRacingEngine';
import { GoldQuestEngine, ChestItemState } from '../../engines/GoldQuestEngine';
import { BossMonsterBattleEngine } from '../../engines/BossMonsterBattleEngine';
import { useLessonStore } from '../../stores/lessonStore';
import { InteractiveExercise } from '@eng-studio/shared-types';

export const ActionGameContainer: React.FC = () => {
  const { activeLesson } = useLessonStore();

  const [activeGame, setActiveGame] = useState<'PENALTY' | 'RACING' | 'CHEST' | 'BOSS'>('PENALTY');
  const [matchMode, setMatchMode] = useState<'SOLO' | 'VERSUS'>('VERSUS');
  const [isMuted, setIsMuted] = useState(false);

  // Classroom Quiz prompt state linked to game actions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [actingTeam, setActingTeam] = useState<'TEAM_1' | 'TEAM_2'>('TEAM_1');

  // Canvas & Engine refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const penaltyEngineRef = useRef<PenaltyShootoutEngine | null>(null);
  const racingEngineRef = useRef<SpeedTurboRacingEngine | null>(null);
  const bossEngineRef = useRef<BossMonsterBattleEngine | null>(null);

  // Gold Quest state
  const [chests, setChests] = useState<ChestItemState[]>([]);
  const [goldScores, setGoldScores] = useState({ TEAM_1: 500, TEAM_2: 500 });
  const goldEngineRef = useRef<GoldQuestEngine | null>(null);

  // Get question bank from lesson or defaults
  const exercises: readonly InteractiveExercise[] =
    activeLesson && activeLesson.exercises.length > 0
      ? activeLesson.exercises
      : [
          {
            exerciseType: 'MULTIPLE_CHOICE',
            question: 'The new sports center in our area is very _______ and modern.',
            options: ['convenient', 'noisy', 'ancient', 'narrow'],
            correctAnswer: 'convenient',
            explanation: 'Chọn "convenient" (tiện lợi) phù hợp với ngữ cảnh trung tâm thể thao hiện đại.',
            slideOrder: 1,
          },
          {
            exerciseType: 'MULTIPLE_CHOICE',
            question: 'Our teacher gave us _______ opportunities to practice penalty shots.',
            options: ['multiple', 'slow', 'dark', 'heavy'],
            correctAnswer: 'multiple',
            explanation: '"Multiple" nghĩa là nhiều/đa dạng lượt thực hành.',
            slideOrder: 2,
          },
          {
            exerciseType: 'MULTIPLE_CHOICE',
            question: 'The penalty shootout was absolutely _______! Everyone cheered loudly.',
            options: ['fantastic', 'boring', 'tired', 'sad'],
            correctAnswer: 'fantastic',
            explanation: '"Fantastic" nghĩa là tuyệt vời, phù hợp với tiếng hò reo cổ vũ.',
            slideOrder: 3,
          },
        ];

  const currentExercise = exercises[currentQuestionIndex % exercises.length];

  // Initialize Game Engines
  const initEngine = useCallback(() => {
    if (activeGame === 'PENALTY' && canvasRef.current) {
      if (penaltyEngineRef.current) penaltyEngineRef.current.destroy();
      penaltyEngineRef.current = new PenaltyShootoutEngine(canvasRef.current, globalClassroomAudio);
      penaltyEngineRef.current.setMode(matchMode);
    } else if (activeGame === 'RACING' && canvasRef.current) {
      if (racingEngineRef.current) racingEngineRef.current.destroy();
      racingEngineRef.current = new SpeedTurboRacingEngine(canvasRef.current, globalClassroomAudio);
    } else if (activeGame === 'CHEST') {
      goldEngineRef.current = new GoldQuestEngine(globalClassroomAudio, () => {
        if (goldEngineRef.current) {
          setChests([...goldEngineRef.current.chests]);
          setGoldScores({
            TEAM_1: goldEngineRef.current.teams.TEAM_1.gold,
            TEAM_2: goldEngineRef.current.teams.TEAM_2.gold,
          });
        }
      });
      setChests([...goldEngineRef.current.chests]);
    } else if (activeGame === 'BOSS' && canvasRef.current) {
      if (bossEngineRef.current) bossEngineRef.current.destroy();
      bossEngineRef.current = new BossMonsterBattleEngine(canvasRef.current, globalClassroomAudio);
    }
  }, [activeGame, matchMode]);

  useEffect(() => {
    initEngine();
    return () => {
      if (penaltyEngineRef.current) penaltyEngineRef.current.destroy();
      if (racingEngineRef.current) racingEngineRef.current.destroy();
      if (bossEngineRef.current) bossEngineRef.current.destroy();
    };
  }, [initEngine]);

  const toggleSound = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    globalClassroomAudio.setMute(nextMute);
  };

  const handleAnswerSubmit = (option: string) => {
    if (feedback !== null) return; // Prevent double submit
    setSelectedOption(option);

    const isCorrect =
      option.trim().toLowerCase() === currentExercise.correctAnswer.trim().toLowerCase();

    if (isCorrect) {
      setFeedback({
        isCorrect: true,
        message: `Chính xác! ${currentExercise.explanation}`,
      });

      // Trigger Game Action
      if (activeGame === 'PENALTY') {
        globalClassroomAudio.playWhistle();
        // Prompt player to touch/click goal target on canvas
      } else if (activeGame === 'RACING') {
        racingEngineRef.current?.triggerNitroBoost(actingTeam);
      } else if (activeGame === 'BOSS') {
        bossEngineRef.current?.castTeamSpell(actingTeam, 'FIREBALL', true);
      }
    } else {
      setFeedback({
        isCorrect: false,
        message: `Chưa chính xác! Đáp án đúng là: ${currentExercise.correctAnswer}. ${currentExercise.explanation}`,
      });

      if (activeGame === 'RACING') {
        racingEngineRef.current?.triggerFaultPenalty(actingTeam);
      } else {
        globalClassroomAudio.playWrong();
        globalClassroomAudio.playBuzzer();
      }
    }

    // Switch turn and advance to next question after delay
    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      setCurrentQuestionIndex((prev) => prev + 1);
      setActingTeam((prev) => (prev === 'TEAM_1' ? 'TEAM_2' : 'TEAM_1'));
    }, 2800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Game Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        {/* Game Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveGame('PENALTY')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'PENALTY'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Sút bóng Penalty</span>
          </button>

          <button
            onClick={() => setActiveGame('RACING')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'RACING'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Đua xe Turbo</span>
          </button>

          <button
            onClick={() => setActiveGame('CHEST')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'CHEST'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Săn rương kho báu</span>
          </button>

          <button
            onClick={() => setActiveGame('BOSS')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'BOSS'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Đấu Boss quái vật</span>
          </button>
        </div>

        {/* Match Mode & Sound Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setMatchMode('VERSUS')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                matchMode === 'VERSUS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Đấu 2 đội (A - B)</span>
            </button>
            <button
              onClick={() => setMatchMode('SOLO')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                matchMode === 'SOLO' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Dạy kèm 1-on-1</span>
            </button>
          </div>

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            onClick={initEngine}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            title="Chơi lại ván mới"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Classroom Pedagogical Question Banner (Triggers Game Mechanics) */}
      <div className="mb-6 rounded-2xl border-2 border-indigo-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <span className="font-bold text-sm text-slate-800">
              Câu hỏi kích hoạt hành động ({currentQuestionIndex + 1}/{exercises.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Lượt trả lời:</span>
            <span
              className={`font-bold text-xs px-2.5 py-0.5 rounded-full ${
                actingTeam === 'TEAM_1'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {actingTeam === 'TEAM_1' ? 'Đội Đỏ' : 'Đội Xanh'}
            </span>
          </div>
        </div>

        <p className="text-xl md:text-2xl font-bold text-slate-900 mb-5">
          {currentExercise.question}
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {currentExercise.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={feedback !== null}
              onClick={() => handleAnswerSubmit(opt)}
              className={`p-3.5 rounded-xl border text-base font-bold transition-all cursor-pointer ${
                selectedOption === opt
                  ? feedback?.isCorrect
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-indigo-50 hover:border-indigo-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Live Feedback Banner */}
        {feedback && (
          <div
            className={`mt-4 rounded-xl p-3.5 flex items-center gap-2.5 text-sm font-semibold ${
              feedback.isCorrect
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {feedback.isCorrect ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Main Canvas / Board View */}
      <div className="rounded-3xl border border-slate-200 bg-slate-950 p-3 shadow-md overflow-hidden flex justify-center items-center">
        {activeGame !== 'CHEST' ? (
          <canvas
            ref={canvasRef}
            width={960}
            height={560}
            className="w-full max-w-5xl rounded-2xl touch-manipulation cursor-pointer"
          />
        ) : (
          /* Gold Quest Custom Interactive HTML Board */
          <div className="w-full max-w-4xl p-6 bg-slate-900 rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl text-white font-mono text-lg font-bold mb-6">
              <div className="text-blue-400">ĐỘI ĐỎ: {goldScores.TEAM_1} VÀNG</div>
              <div className="bg-slate-700 px-4 py-1 rounded text-sm text-amber-300">
                LƯỢT MỞ: {goldEngineRef.current?.currentTurn === 'TEAM_1' ? 'ĐỘI ĐỎ' : 'ĐỘI XANH'}
              </div>
              <div className="text-rose-400">ĐỘI XANH: {goldScores.TEAM_2} VÀNG</div>
            </div>

            {/* 12 Chests Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {chests.map((chest) => (
                <button
                  key={chest.idx}
                  disabled={chest.opened}
                  onClick={() => goldEngineRef.current?.openChest(chest.idx)}
                  className={`h-28 rounded-xl border-2 font-mono font-bold text-sm transition-all duration-200 cursor-pointer ${
                    chest.opened
                      ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-md scale-95'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750 hover:border-amber-400/50'
                  }`}
                >
                  {chest.opened ? chest.loot.label : `[ RƯƠNG #${chest.idx + 1} ]`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Classroom Guide for Penalty Shootout */}
      {activeGame === 'PENALTY' && (
        <div className="mt-4 text-center text-xs text-slate-500 font-medium">
          Hướng dẫn sút phạt: Sau khi trả lời đúng, học sinh hãy chạm vào 1 trong 5 vòng tròn mục tiêu (Góc cao trái, Góc cao phải, Chính diện, Góc thấp) để thực hiện cú sút!
        </div>
      )}
    </div>
  );
};
