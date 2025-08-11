# Fastify Starter

Fastify 시작 템플릿입니다. mongoDB와 mongoose, redis DB를 사용할 수 있게 적용되어 있습니다.

## 설치

### 패키지 설치

```bash
yarn
```

### 환경 변수 적용

```bash
cp .env.example .env
```

예제 파일로 .env 파일 생성 후 알맞게 설정합니다.

## 실행

### 개발 환경 실행

```bash
yarn dev
```

### 빌드

```bash
yarn build
```

### 실행

```bash
yarn start
```

## Fastify Module Factory 사용 가이드

팩토리 패턴을 사용하여 타입 세이프한 Fastify 라우트 모듈을 생성하는 방법을 설명합니다.

### 1. JSON 스키마와 함께 사용

```typescript
import type { Handler } from '~/lib/module-factory';

// 스키마 정의
const getUserSchema = {
  querystring: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
    },
  },
} as const;

// 타입 세이프한 핸들러
const handleGetUser: Handler<typeof getUserSchema> = async (request, reply) => {
  const { id } = request.query;
  reply.status(200).send({ id, name: 'hong' });
};

// 스키마와 함께 라우트 모듈 생성
const UserModule = createModule({ prefix: '/users' }, [
  createRoute('/', 'GET', handleGetUser, getUserSchema),
]);
```

### 2. 모듈 컴포지션

정의한 모듈을 `src/config.ts`파일의 MODULES 상수에 추가하면, fastify가 실행될 때 모든 모듈의 라우트가 합성됩니다.

```typescript
import type { Module } from './lib/module-factory';
import UserModule from './modules/user/module';

export const MODULES: Module[] = [UserModule] as const;
```
