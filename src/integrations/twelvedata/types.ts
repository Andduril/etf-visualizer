export type ApiStatus = 'ok' | 'error';

export interface ApiErrorResponse {
  status: 'error';
  code?: number | string;
  message?: string;
}

export type ApiOkResponse<T> = {
  data: T;
  status: 'ok';
  message?: string;
};

export type ApiResponse<T> = ApiOkResponse<T> | ApiErrorResponse;
