import type { FastifyInstance } from 'fastify';

import { SwaggerTag } from '~/common/server';
import type { FromJsonSchema, Module } from '~/common/types';

const getHealthSchema = {
  tags: [SwaggerTag.ETC],
  summary: '헬스체크',
  description: '헬스체크',
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
      },
      required: ['status'],
    },
  },
} as const;

const HealthRouter: Module = {
  prefix: '/health',
  routes: [
    (app: FastifyInstance) => {
      app.get<FromJsonSchema<typeof getHealthSchema>>(
        '/',
        { schema: getHealthSchema },
        (_, reply) => {
          reply.status(200).send({ status: 'ok' });
        },
      );
    },
  ],
};

export default HealthRouter;
