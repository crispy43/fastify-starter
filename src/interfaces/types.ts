import type { FastifyInstance } from 'fastify';

export type Route = (app: FastifyInstance) => void;

export type Router = {
  prefix: string;
  routes: Route[];
};
