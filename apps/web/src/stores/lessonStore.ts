import { create, StateCreator } from 'zustand';
import { apiClient } from '../services/apiClient';
import {
  ApiResponse,
  LessonBundle,
  IngestionPreviewResult,
  IngestLessonRequest,
  CreateLessonDto,
  VocabularyItem,
} from '@eng-studio/shared-types';

export type StudioViewMode =
  | 'INGESTION'
  | 'REVIEW'
  | 'PRESENTATION'
  | 'GAMES'
  | 'EXERCISES';

interface LessonState {
  viewMode: StudioViewMode;
  activeLesson: LessonBundle | null;
  ingestionPreview: IngestionPreviewResult | null;
  currentSlideIndex: number;
  isLoading: boolean;
  error: string | null;

  setViewMode: (mode: StudioViewMode) => void;
  setCurrentSlideIndex: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  loadLessonByPin: (pinCode: string) => Promise<boolean>;
  ingestContent: (dto: IngestLessonRequest) => Promise<boolean>;
  updatePreviewVocabulary: (updatedList: VocabularyItem[]) => void;
  saveFullLesson: (lessonData: CreateLessonDto) => Promise<boolean>;
  setActiveLessonDirectly: (lesson: LessonBundle) => void;
  resetAll: () => void;
}

const lessonStateCreator: StateCreator<LessonState> = (set, get) => ({
  viewMode: 'INGESTION',
  activeLesson: null,
  ingestionPreview: null,
  currentSlideIndex: 0,
  isLoading: false,
  error: null,

  setViewMode: (mode: StudioViewMode) => set({ viewMode: mode }),

  setCurrentSlideIndex: (index: number) => set({ currentSlideIndex: index }),

  nextSlide: () => {
    const { activeLesson, currentSlideIndex } = get();
    if (!activeLesson) return;
    const totalVocab = activeLesson.vocabularyList.length;
    if (currentSlideIndex < totalVocab - 1) {
      set({ currentSlideIndex: currentSlideIndex + 1 });
    }
  },

  prevSlide: () => {
    const { currentSlideIndex } = get();
    if (currentSlideIndex > 0) {
      set({ currentSlideIndex: currentSlideIndex - 1 });
    }
  },

  loadLessonByPin: async (pinCode: string): Promise<boolean> => {
    const cleanPin = pinCode.trim().toUpperCase();
    if (!cleanPin) {
      set({ error: 'Mã bài giảng không được để trống' });
      return false;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.get<ApiResponse<LessonBundle>>(`/lessons/pin/${cleanPin}`);
      if (res.data.status && res.data.data) {
        set({
          activeLesson: res.data.data,
          viewMode: 'PRESENTATION',
          currentSlideIndex: 0,
          isLoading: false,
          error: null,
        });
        return true;
      }
      set({ isLoading: false, error: res.data.message });
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không tìm thấy bài giảng theo mã PIN';
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  ingestContent: async (dto: IngestLessonRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.post<ApiResponse<IngestionPreviewResult>>('/lessons/ingest', dto);
      if (res.data.status && res.data.data) {
        set({
          ingestionPreview: res.data.data,
          viewMode: 'REVIEW',
          isLoading: false,
          error: null,
        });
        return true;
      }
      set({ isLoading: false, error: res.data.message });
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể bóc tách nội dung bài học';
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  updatePreviewVocabulary: (updatedList: VocabularyItem[]) => {
    const { ingestionPreview } = get();
    if (!ingestionPreview) return;
    set({
      ingestionPreview: {
        ...ingestionPreview,
        vocabularyList: updatedList,
      },
    });
  },

  saveFullLesson: async (lessonData: CreateLessonDto): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.post<ApiResponse<LessonBundle>>('/lessons', lessonData);
      if (res.data.status && res.data.data) {
        set({
          activeLesson: res.data.data,
          viewMode: 'PRESENTATION',
          currentSlideIndex: 0,
          isLoading: false,
          error: null,
        });
        return true;
      }
      set({ isLoading: false, error: res.data.message });
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể lưu bài giảng';
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  setActiveLessonDirectly: (lesson: LessonBundle) => {
    set({
      activeLesson: lesson,
      viewMode: 'PRESENTATION',
      currentSlideIndex: 0,
      error: null,
    });
  },

  resetAll: () =>
    set({
      viewMode: 'INGESTION',
      activeLesson: null,
      ingestionPreview: null,
      currentSlideIndex: 0,
      isLoading: false,
      error: null,
    }),
});

export const useLessonStore = create<LessonState>(lessonStateCreator);
