import { SwaggerTag } from '~/common/server';
import type { Handler } from '~/lib/module-factory';
import { createModule, createRoute } from '~/lib/module-factory';

const getHealthSchema = {
  tags: [SwaggerTag.ETC],
  summary: '헬스체크',
  description: '헬스체크',
  response: {
    200: {
      type: 'object',
      properties: { status: { type: 'string' } },
      required: ['status'],
    },
  },
} as const;

const handleGetHealth: Handler<typeof getHealthSchema> = async (_, reply) => {
  reply.status(200).send({ status: 'ok' });
};

const HealthModule = createModule({ prefix: '/health' }, [
  createRoute('/', 'GET', handleGetHealth, getHealthSchema),
]);

export default HealthModule;
