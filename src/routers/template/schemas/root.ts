import { SwaggerTag } from '~/constants/server';

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
