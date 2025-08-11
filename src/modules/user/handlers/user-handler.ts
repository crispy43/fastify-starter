import { NotFoundException } from '~/lib/exceptions';
import type { Handler } from '~/lib/module-factory';
import UserModel from '~/models/user';

import type { createUserSchema, getUserSchema } from '../schemas/user-schema';

// 유저 조회
export const handleGetUser: Handler<typeof getUserSchema> = async (request, reply) => {
  const { name } = request.query;
  const user = await UserModel().findOne({ name });
  if (!user) throw new NotFoundException('User not found', 'name');
  reply.status(200).send(user.toJSON());
};

// 유저 생성
export const handleCreateUser: Handler<typeof createUserSchema> = async (
  request,
  reply,
) => {
  const { name } = request.body;
  const user = await UserModel().create({ name });
  reply.status(201).send(user.toJSON());
};
