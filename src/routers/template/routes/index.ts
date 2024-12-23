import type { FastifyInstance } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';

import { SwaggerTags } from '~/constants/app';
import type { Route } from '~/interfaces/types';
import { UserModel } from '~/models';
import userSchema, { User } from '~/models/user';

import { dummySchema } from '../schemas/dummy';

const path = '/';

const root: Route = (app: FastifyInstance) => {
  // * GET
  app.get<{
    Querystring: FromSchema<typeof dummySchema>;
    Reply: User[];
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
    path,
    {
      schema: {
        description: '탬플릿',
        tags: [SwaggerTags.ETC],
        body: dummySchema,
        response: {
          200: {
            type: 'array',
            items: userSchema,
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
