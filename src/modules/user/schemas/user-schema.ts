import { SwaggerTag } from '~/common/server';
import { userJsonSchema } from '~/db/prisma/schemas/user';

// params, querystring, body, response의 각 필드는 JSON schema 기준으로 스키마 작성
// 정의한 스키마는 FromJsonSchema 제네릭 타입으로 타입 매칭하여 사용
// https://github.com/ThomasAribart/json-schema-to-ts#readme

export const getUserSchema = {
  tags: [SwaggerTag.ETC],
  summary: '탬플릿',
  description: '탬플릿',
  querystring: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: ['email'],
  },
  response: {
    200: userJsonSchema,
  },
} as const;

export const createUserSchema = {
  tags: [SwaggerTag.ETC],
  summary: '탬플릿',
  description: '탬플릿',
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      name: { type: 'string' },
    },
    required: ['email'],
  },
  response: {
    200: userJsonSchema,
  },
} as const;
