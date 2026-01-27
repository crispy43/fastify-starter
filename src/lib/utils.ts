import type { ToJson } from '~/common/types';

export default function utils() {}

// * 환경변수 가져오기
export const env = (name: string, defaultValue?: string) => {
  const env = process.env[name];
  if (!env && !defaultValue) {
    throw new Error(`Please define the ${name} environment variable.`);
  }
  return env ? env : defaultValue;
};

// * Query string으로 변환
export const formatQuery = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'undefined') return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (typeof v !== 'undefined') {
          searchParams.append(key, encodeURIComponent(String(v)));
        }
      });
    } else {
      searchParams.append(key, encodeURIComponent(String(value)));
    }
  });
  return searchParams.toString();
};

// * JSON fetch
export const fetchJson = async <T = any>(
  url: string,
  options?: RequestInit,
): Promise<{
  status?: number;
  headers?: Headers;
  data: ToJson<T & { error?: string; message?: string; path?: string }>;
}> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    const status = response.status;
    const headers = response.headers;
    const data = (await response.json()) as ToJson<
      T & { error?: string; message?: string; path?: string }
    >;
    return { status, headers, data };
  } catch (error) {
    console.error(error);
    return {
      data: {
        error: 'Unknown Error',
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred while fetching data',
      } as ToJson<T & { error?: string; message?: string; path?: string }>,
    };
  }
};

// * Timeout promise
export const withTimeout = <T>(
  promise: Promise<T>,
  timeout: number,
  errorMessage: string = 'timeout',
): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeout);
  });
  return Promise.race([promise, timeoutPromise]);
};
