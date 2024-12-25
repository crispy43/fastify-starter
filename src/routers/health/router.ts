import type { FastifyInstance } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';

import { SwaggerTag } from '~/constants/server';
import type { Router } from '~/interfaces/types';

export const okSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' },
  },
  required: ['status'],
} as const;

const HealthRouter: Router = {
  prefix: '/health',
  routes: [
    (app: FastifyInstance) => {
      app.get<{
        Reply: FromSchema<typeof okSchema>;
      }>(
        '/',
        {
          schema: {
            description: '헬스체크',
            tags: [SwaggerTag.ETC],
            response: {
              200: okSchema,
            },
          },
        },
        (_, reply) => {
          reply.status(200).send({ status: 'ok' });
        },
      );
    },
  ],
};

export default HealthRouter;
