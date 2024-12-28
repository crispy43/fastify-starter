import type { FastifyInstance } from 'fastify';

import type { FromJsonSchema, Route } from '~/interfaces/types';

import { getRootSchema, postRootSchema } from '../schemas/root';

const PATH = '/';

const root: Route = (app: FastifyInstance) => {
  // * GET
  app.get<FromJsonSchema<typeof getRootSchema>>(
    PATH,
    {
      schema: getRootSchema,
    },
    async (request, reply) => {
      const { name } = request.query;
      reply.status(200).send({ name });
    },
  );

  // * POST
  app.post<FromJsonSchema<typeof postRootSchema>>(
    PATH,
    {
      schema: postRootSchema,
    },
    async (request, reply) => {
      const { name } = request.body;
      reply.status(200).send({ name });
    },
  );
};

export default root;
