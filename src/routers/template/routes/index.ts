import type { FastifyInstance } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';

import { SwaggerTags } from '~/constants/app';
import type { Route } from '~/interfaces/types';

import { dummySchema } from '../schemas/dummy';

const path = '/';

const root: Route = (app: FastifyInstance) => {
  // * GET
  app.get<{
    Querystring: FromSchema<typeof dummySchema>;
    Reply: FromSchema<typeof dummySchema>;
  }>(
    path,
    {
      schema: {
        description: '탬플릿',
        tags: [SwaggerTags.ETC],
        querystring: dummySchema,
        response: {
          200: dummySchema,
        },
      },
    },
    (request, reply) => {
      const { name } = request.query;
      reply.status(200).send({ name });
    },
  );

  // * POST
  app.post<{
    Body: FromSchema<typeof dummySchema>;
    Reply: FromSchema<typeof dummySchema>;
  }>(
    path,
    {
      schema: {
        description: '탬플릿',
        tags: [SwaggerTags.ETC],
        body: dummySchema,
        response: {
          200: dummySchema,
        },
      },
    },
    (request, reply) => {
      const { name } = request.body;
      reply.status(200).send({ name });
    },
  );
};

export default root;
