import type { FromSchema } from 'json-schema-to-ts';

export type FromJsonSchema<T> = {
  Params: T extends { params: infer P } ? FromSchema<P> : never;
  Querystring: T extends { querystring: infer Q } ? FromSchema<Q> : never;
  Body: T extends { body: infer B } ? FromSchema<B> : never;
  Headers: T extends { headers: infer H } ? FromSchema<H> : never;
  Reply: T extends { response: { '200': infer R } } ? FromSchema<R> : never;
};
