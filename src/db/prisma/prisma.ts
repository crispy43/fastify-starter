import type { PrismaClient } from './.generated/prisma/client';

let prismaClient: PrismaClient;

export const setPrisma = (client: PrismaClient) => {
  prismaClient = client;
};

export const prisma = () => {
  if (!prismaClient) throw new Error('Prisma not initialized');
  return prismaClient;
};
