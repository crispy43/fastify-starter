import UserModel from '~/db/mongoose/models/error-log';
import { NotFoundException } from '~/lib/exceptions';
import type { Handler } from '~/lib/module-factory';

import type { createUserSchema, getUserSchema } from '../schemas/user-schema';
import { prisma } from '~/db/prisma/prisma';

// 유저 조회
export const handleGetUser: Handler<typeof getUserSchema> = async (request, reply) => {
  const { email } = request.query;
  const user = await prisma().user.findUnique({ where: { email } });
  if (!user) throw new NotFoundException('User not found', 'email');
  reply.status(200).send(user);
};

// 유저 생성
export const handleCreateUser: Handler<typeof createUserSchema> = async (
  request,
  reply,
) => {
  const { email, name } = request.body;
  const user = await prisma().user.create({
    data: {
      email,
      name,
    },
  });
  reply.status(201).send(user);
};
