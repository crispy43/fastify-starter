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
