import { ObjectId } from 'mongoose';

// * JSON 직렬화 타입 추론 (Jsonify)
// NOTE: Serializable하지 않은 타입은 loader와 action 함수에서 반환 시 타입 유실 발생하므로,
// NOTE: 타입 유실 방지를 위해 toJson 함수로 JSON 직렬화 반환하는 경우 사용
type JsonPrimitive = string | number | boolean | null;

// JSON으로 보낼 수 있는 값 형태
type JsonValue = JsonPrimitive | JsonValue[] | { [k: string]: JsonValue };

// 깊이 제한
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// 배열 원소는 undefined -> null (JSON.stringify 동작과 일치)
type ToJsonArrayElem<T, D extends number> =
  ToJsonValue<T, D> extends infer V ? (V extends undefined ? null : V) : never;

// 객체 undefined인 필드는 키 제거(omit)
type ToJsonObject<T extends Record<string, any>, D extends number> = {
  [K in keyof T as ToJsonValue<T[K], D> extends undefined ? never : K]: ToJsonValue<
    T[K],
    D
  > extends infer V
    ? V extends JsonValue
      ? V
      : never
    : never;
};

// JSON 타입 추론
type ToJsonValue<T, D extends number> = D extends 0
  ? JsonValue // 깊이 제한 도달 시 (TS 컴파일러 에러 방지)
  : T extends JsonPrimitive
    ? T // primitives
    : T extends undefined
      ? undefined
      : // ObjectId는 문자열로 변환
        T extends ObjectId
        ? string
        : // JSON 불가
          T extends bigint | symbol | ((...args: any[]) => any)
          ? undefined
          : T extends ArrayBuffer | ArrayBufferView
            ? undefined
            : T extends Map<any, any> | Set<any>
              ? undefined
              : // 기본 ToJSON 메소드 변환
                T extends Date
                ? string
                : T extends URL
                  ? string
                  : T extends RegExp
                    ? string
                    : T extends Error
                      ? { name: string; message: string; stack?: string }
                      : // Promise는 내부만 변환
                        T extends Promise<infer U>
                        ? Promise<ToJsonValue<U, Prev[D] & number>>
                        : // 배열/튜플
                          T extends readonly any[]
                          ? { [K in keyof T]: ToJsonArrayElem<T[K], Prev[D] & number> }
                          : T extends Array<infer U>
                            ? Array<ToJsonArrayElem<U, Prev[D] & number>>
                            : T extends ReadonlyArray<infer U>
                              ? ReadonlyArray<ToJsonArrayElem<U, Prev[D] & number>>
                              : // object
                                T extends Record<string, any>
                                ? ToJsonObject<T, Prev[D] & number>
                                : undefined;

// JsonValue 형태로
export type ToJson<T, Depth extends number = 7> =
  ToJsonValue<T, Depth> extends infer V
    ? V extends JsonValue
      ? V
      : undefined
    : undefined;
