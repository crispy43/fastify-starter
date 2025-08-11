import { SwaggerTag } from '~/common/server';

// params, querystring, body, response의 각 필드는 JSON schema 기준으로 스키마 작성
// 정의한 스키마는 FromJsonSchema 제네릭 타입으로 타입 매칭하여 사용
// https://github.com/ThomasAribart/json-schema-to-ts#readme

export const getRootSchema = {
  tags: [SwaggerTag.ETC],
  summary: '탬플릿',
  description: '탬플릿',
  querystring: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    },
  },
} as const;

export const postRootSchema = {
  tags: [SwaggerTag.ETC],
  summary: '탬플릿',
  description: '탬플릿',
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    },
  },
} as const;
