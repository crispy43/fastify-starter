import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import type { FromJsonSchema } from '~/common/types';

export type Route = (app: FastifyInstance) => void;

export type Module = {
  prefix: string;
  routes: Route[];
};

// * Factory function types
export type ModuleConfig = {
  prefix: string;
};

export type Handler<TSchema = any> = (
  request: FastifyRequest<FromJsonSchema<TSchema>>,
  reply: FastifyReply<FromJsonSchema<TSchema>>,
  app: FastifyInstance,
) => Promise<void> | void;

export type Builder<T = any> = {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  schema?: T;
  handler: Handler<T>;
};

// * Factory function to create type-safe route modules
export function createModule<TConfig extends ModuleConfig, TRoutes extends Builder[]>(
  config: TConfig,
  routes: TRoutes,
): Module {
  const buildRoutes = (): Route[] => {
    return routes.map((routeBuilder) => {
      return (app: FastifyInstance) => {
        const { path, method, schema, handler } = routeBuilder;

        const routeOptions = schema ? { schema } : {};

        switch (method) {
          case 'GET':
            app.get<FromJsonSchema<typeof schema>>(path, routeOptions, (request, reply) =>
              handler(request, reply, app),
            );
            break;
          case 'POST':
            app.post<FromJsonSchema<typeof schema>>(
              path,
              routeOptions,
              (request, reply) => handler(request, reply, app),
            );
            break;
          case 'PUT':
            app.put<FromJsonSchema<typeof schema>>(path, routeOptions, (request, reply) =>
              handler(request, reply, app),
            );
            break;
          case 'DELETE':
            app.delete<FromJsonSchema<typeof schema>>(
              path,
              routeOptions,
              (request, reply) => handler(request, reply, app),
            );
            break;
          case 'PATCH':
            app.patch<FromJsonSchema<typeof schema>>(
              path,
              routeOptions,
              (request, reply) => handler(request, reply, app),
            );
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
      };
    });
  };

  return {
    prefix: config.prefix,
    routes: buildRoutes(),
  };
}

// * Helper function to create route builders
export function createRoute<TSchema = any>(
  path: string,
  method: Builder['method'],
  handler: Handler<TSchema>,
  schema?: TSchema,
): Builder<TSchema> {
  return {
    path,
    method,
    schema,
    handler,
  };
}
