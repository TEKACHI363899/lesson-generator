import React, { ReactNode } from 'react';
import { Loader2, AlertCircle, RotateCcw, FileQuestion } from 'lucide-react';

interface StateBoundaryProps<T> {
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly data: T | null | undefined;
  readonly onRetry?: () => void;
  readonly isEmpty?: (data: T) => boolean;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly loadingMessage?: string;
  readonly children: (data: T) => ReactNode;
}

export function StateBoundary<T>({
  isLoading,
  error,
  data,
  onRetry,
  isEmpty,
  emptyTitle = 'Chưa có dữ liệu bài giảng',
  emptyDescription = 'Hãy nạp nội dung bài học bằng ảnh chụp màn hình hoặc nhập prompt để bắt đầu.',
  loadingMessage = 'Đang xử lý dữ liệu...',
  children,
}: StateBoundaryProps<T>): React.ReactElement {
  if (isLoading) {
    return (
      <div
        role="status"
        className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/80 p-10 text-center shadow-sm backdrop-blur-sm"
      >
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" aria-hidden="true" />
        <p className="mt-4 font-medium text-slate-700 tracking-wide">{loadingMessage}</p>
        <span className="text-xs text-slate-400 mt-1">Đang phân tích cấu trúc ngôn ngữ và hoạt họa...</span>
      </div>
    );
  }

  if (error !== null) {
    return (
      <div
        role="alert"
        className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/60 p-10 text-center shadow-sm"
      >
        <div className="rounded-full bg-rose-100 p-3">
          <AlertCircle className="h-8 w-8 text-rose-600" aria-hidden="true" />
        </div>
        <h4 className="mt-4 text-lg font-bold text-rose-900">Đã xảy ra sự cố</h4>
        <p className="mt-1 max-w-md text-sm text-rose-700">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Thử lại</span>
          </button>
        )}
      </div>
    );
  }

  const isDataEmpty =
    data === null ||
    data === undefined ||
    (Array.isArray(data) && data.length === 0) ||
    (isEmpty ? isEmpty(data) : false);

  if (isDataEmpty) {
    return (
      <div
        role="status"
        className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center shadow-sm"
      >
        <div className="rounded-full bg-slate-100 p-4">
          <FileQuestion className="h-10 w-10 text-slate-400" aria-hidden="true" />
        </div>
        <h4 className="mt-4 text-xl font-bold text-slate-800">{emptyTitle}</h4>
        <p className="mt-1.5 max-w-md text-sm text-slate-500">{emptyDescription}</p>
      </div>
    );
  }

  return <>{children(data as T)}</>;
}
