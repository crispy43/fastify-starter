import type { FastifyInstance } from 'fastify';

import { SwaggerTag } from '~/constants/server';
import type { FromJsonSchema, Router } from '~/interfaces/types';

const getHealthSchema = {
  summary: '헬스체크',
  description: '헬스체크',
  tags: [SwaggerTag.ETC],
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

const HealthRouter: Router = {
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
