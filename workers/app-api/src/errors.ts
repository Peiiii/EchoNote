export type ApiErrorCode =
  | "unauthorized"
  | "forbidden"
  | "invalid_request"
  | "rate_limited"
  | "not_found"
  | "conflict"
  | "internal";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(code: ApiErrorCode, message: string, status: number, details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function errorResponse(err: ApiError, requestId: string): Response {
  return new Response(
    JSON.stringify({
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? undefined,
      },
    }),
    {
      status: err.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Request-Id": requestId,
      },
    }
  );
}

