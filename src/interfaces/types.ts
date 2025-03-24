import type { FastifyInstance } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

export type Route = (app: FastifyInstance) => void;

export type Module = {
  prefix: string;
  routes: Route[];
};

export type FromJsonSchema<T> = {
  Querystring: T extends { querystring: infer Q } ? FromSchema<Q> : never;
  Body: T extends { body: infer B } ? FromSchema<B> : never;
  Headers: T extends { headers: infer H } ? FromSchema<H> : never;
  Reply: T extends { response: { '200': infer R } } ? FromSchema<R> : never;
};
