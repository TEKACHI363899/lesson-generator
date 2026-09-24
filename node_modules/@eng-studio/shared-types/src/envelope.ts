export interface ApiResponse<T = unknown> {
  readonly code: number;
  readonly status: boolean;
  readonly message: string;
  readonly data: T | null;
  readonly timestamp?: string;
  readonly path?: string;
}

export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly totalItems: number;
  readonly totalPages: number;
}

export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly meta: PaginationMeta;
}
