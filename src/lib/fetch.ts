export type FetchJsonOk<T> = {
  ok: true;
  status: number;
  headers: Headers;
  data: T;
};

export type FetchJsonErr<E = unknown> = {
  ok: false;
  status?: number;
  headers?: Headers;
  error?: E;
  rawText?: string;
  cause?: unknown;
};

export type FetchJsonResult<T, E = unknown> = FetchJsonOk<T> | FetchJsonErr<E>;

// Headers + object/string[][] 혼합을 안전하게 merge
function mergeHeaders(base?: HeadersInit, extra?: HeadersInit): HeadersInit {
  const h = new Headers(base);
  if (extra) new Headers(extra).forEach((v, k) => h.set(k, v));
  return h;
}

// JSON 파싱 시도 (실패 시 undefined 반환)
function tryParseJson(text: string): unknown | undefined {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

// * 안전한 fetch (에러 핸들링 포함)
export async function safeFetch<T = unknown, E = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<FetchJsonResult<T, E>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: mergeHeaders({ Accept: 'application/json' }, options.headers),
    });

    const status = response.status;
    const headers = response.headers;

    // 응답 본문 text로 먼저 확인 후 JSON 파싱 시도
    const rawText = await response.text();
    const contentType = headers.get('content-type')?.toLowerCase() ?? '';
    const looksJson = rawText.trim().startsWith('{') || rawText.trim().startsWith('[');
    const shouldParseJson = contentType.includes('application/json') || looksJson;
    const parsed = shouldParseJson ? (tryParseJson(rawText) as T | undefined) : undefined;

    // 성공 응답 처리
    if (response.ok) {
      return { ok: true, status, headers, data: (parsed ?? (undefined as any)) as T };
    }

    // 에러 응답 처리
    const errorBody = parsed as unknown as E | undefined;
    return {
      ok: false,
      status,
      headers,
      error: errorBody,
      rawText: rawText || undefined,
    };
  } catch (cause) {
    return {
      ok: false,
      cause,
    };
  }
}

// Timeout 에러 클래스
export class TimeoutError extends Error {
  constructor(message = 'timeout') {
    super(message);
    this.name = 'TimeoutError';
  }
}

// * Promise에 Timeout 적용 유틸리티
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'timeout',
): Promise<T> {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return promise;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(errorMessage)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

// * Timeout signal 생성 유틸리티 (fetch 타임아웃 abort signal용)
// 예: `const { signal, cancel } = withTimeoutSignal(5000); fetch(url, { signal });`
// 사용 후 `cancel()` 호출로 타이머 정리 및 외부 signal 이벤트 제거
export function withTimeoutSignal(timeoutMs: number, signal?: AbortSignal) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return { signal, cancel: () => {} };

  const controller = new AbortController();

  // 외부 signal이 abort되면 같이 abort
  const onAbort = () => controller.abort(signal?.reason);
  if (signal) signal.addEventListener('abort', onAbort, { once: true });

  const timer = setTimeout(
    () => controller.abort(new TimeoutError('timeout')),
    timeoutMs,
  );

  const cancel = () => {
    clearTimeout(timer);
    if (signal) signal.removeEventListener('abort', onAbort);
  };

  return { signal: controller.signal, cancel };
}
