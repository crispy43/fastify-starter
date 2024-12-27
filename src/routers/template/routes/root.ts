import type { FastifyInstance } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';

import { SwaggerTag } from '~/constants/server';
import type { Route } from '~/interfaces/types';
import { UserModel } from '~/models';
import { User, userJsonSchema } from '~/models/user';

import { dummySchema } from '../schemas/dummy';

const PATH = '/';

const root: Route = (app: FastifyInstance) => {
  // * GET
  app.get<{
    Querystring: FromSchema<typeof dummySchema>;
    Reply: User[];
  }>(
    PATH,
    {
      schema: {
        description: '탬플릿',
        tags: [SwaggerTag.ETC],
        querystring: dummySchema,
        response: {
          200: {
            type: 'array',
            items: userJsonSchema,
          },
        },
      },
    },
    async (request, reply) => {
      const { name } = request.query;
      const users = await UserModel.find<User>({ name });
      reply.status(200).send(users);
    },
  );

  // * POST
  app.post<{
    Body: FromSchema<typeof dummySchema>;
    Reply: User[];
  }>(
    PATH,
    {
      schema: {
        description: '탬플릿',
        tags: [SwaggerTag.ETC],
        body: dummySchema,
        response: {
          200: {
            type: 'array',
            items: userJsonSchema,
          },
        },
      },
    },
    async (request, reply) => {
      const { name } = request.body;
      const users = await UserModel.find<User>({ name });
      reply.status(200).send(users);
    },
  );
};

export default root;
