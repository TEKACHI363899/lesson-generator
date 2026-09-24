import React, { useState, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Sparkles,
  X,
  Clipboard,
  Layers,
  Clock,
  GraduationCap,
} from 'lucide-react';
import { useLessonStore } from '../../stores/lessonStore';

export const LessonIngestionModal: React.FC = () => {
  const { ingestContent, isLoading } = useLessonStore();

  const [topic, setTopic] = useState('My Wonderful Neighbourhood');
  const [grade, setGrade] = useState<number>(6);
  const [duration, setDuration] = useState<number>(45);
  const [promptText, setPromptText] = useState(
    'Dạy từ vựng miêu tả khu phố, các tính từ chỉ đặc điểm nơi chốn (convenient, historic, fantastic, neighbourhood) và bài tập ngữ pháp câu.',
  );
  const [images, setImages] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Global Ctrl + V listener to paste screenshots from clipboard directly
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setImages((prev) => [...prev, event.target!.result as string]);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await ingestContent({
      promptText,
      imageBase64List: images,
      targetGrade: grade,
      topic,
      durationMinutes: duration,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Bước 1: Nạp nội dung bài học</span>
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Khởi tạo Bài giảng Tiếng Anh Thông minh
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
          Dán ảnh chụp màn hình sách giáo khoa (Ctrl + V) hoặc nhập yêu cầu để AI bóc tách từ vựng, âm tiết, trò chơi sút bóng và bài tập.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Configuration Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            <span>Thông số bài học</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                Chủ đề bài học (Topic)
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Ví dụ: My Neighbourhood"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-slate-400" />
                <span>Khối lớp (Độ tuổi 7-15)</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                <option value={2}>Lớp 2 (7 tuổi)</option>
                <option value={3}>Lớp 3 (8 tuổi)</option>
                <option value={4}>Lớp 4 (9 tuổi)</option>
                <option value={5}>Lớp 5 (10 tuổi)</option>
                <option value={6}>Lớp 6 (11 tuổi)</option>
                <option value={7}>Lớp 7 (12 tuổi)</option>
                <option value={8}>Lớp 8 (13 tuổi)</option>
                <option value={9}>Lớp 9 (14-15 tuổi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Thời lượng tiết dạy</span>
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                <option value={35}>35 phút (Tiểu học)</option>
                <option value={45}>45 phút (Chuẩn phổ thông)</option>
                <option value={60}>60 phút (Kèm tăng cường)</option>
                <option value={90}>90 phút (2 tiết đôi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Input Method 1: Prompt Text Input */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <label className="block text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            <span>Nội dung hướng dẫn sư phạm (Prompt)</span>
          </label>
          <textarea
            rows={3}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Nhập yêu cầu từ vựng, ngữ pháp trọng tâm, ví dụ: Unit 4 Tiếng Anh 6 - My Neighbourhood, các từ vựng chỉ địa điểm và bài tập ngữ pháp so sánh..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* Input Method 2: Screenshot Ingestion (Ctrl+V Clipboard & Drag-Drop) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <label className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-indigo-600" />
              <span>Ảnh chụp màn hình sách giáo khoa / Phiếu bài tập</span>
            </label>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-mono font-semibold text-slate-600">
              <Clipboard className="h-3 w-3" />
              <span>Hỗ trợ dán trực tiếp: Ctrl + V</span>
            </span>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
              isDragOver
                ? 'border-indigo-500 bg-indigo-50/50'
                : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              Kéo thả ảnh vào đây, hoặc nhấn Ctrl + V sau khi chụp màn hình
            </p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Hỗ trợ PNG, JPG, JPEG từ Snipping Tool, sách điện tử, hoặc camera
            </p>

            <label className="cursor-pointer rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors">
              <span>Chọn ảnh từ máy tính</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Thumbnails of Added Images */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="group relative h-28 rounded-xl border border-slate-200 overflow-hidden bg-slate-100"
                >
                  <img
                    src={img}
                    alt={`Screenshot ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1.5 right-1.5 rounded-full bg-slate-900/80 p-1 text-white hover:bg-rose-600 transition-colors"
                    title="Xóa ảnh này"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-mono text-white">
                    Ảnh #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit CTA */}
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Sparkles className="h-5 w-5" />
            <span>
              {isLoading
                ? 'Đang phân tích và bóc tách từ vựng...'
                : 'Tiếp tục: Bóc tách Từ vựng & Ngữ pháp'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
