export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
};

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error,
    };
  }
  
  if (typeof error === 'string') {
    return { message: error };
  }
  
  return {
    message: 'An unknown error occurred',
    details: error,
  };
}
