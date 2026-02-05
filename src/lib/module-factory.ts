import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import type { FromJsonSchema } from '~/common/types/types';

export type Route = (app: FastifyInstance) => void;

export type Module = {
  prefix: string;
  routes: Route[];
};

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

export type ModuleItem = Builder<any> | Module;

const isModule = (item: ModuleItem): item is Module => {
  return (item as Module).routes !== undefined;
};

// * Factory function to create route modules (nested module 지원)
export function createModule<
  TConfig extends ModuleConfig,
  TItems extends readonly ModuleItem[],
>(config: TConfig, items: TItems): Module {
  const buildRoutes = (list: readonly ModuleItem[]): Route[] => {
    return list.map((item) => {
      // Module이면: route 선언이 아니라 sub-module register로 감싼다 (재귀)
      if (isModule(item)) {
        return (app: FastifyInstance) => {
          app.register(
            async (subApp) => {
              item.routes.forEach((r) => r(subApp));
            },
            { prefix: item.prefix },
          );
        };
      }

      // Builder이면: 기존처럼 route 등록
      return (app: FastifyInstance) => {
        const { path, method, schema, handler } = item;
        const routeOptions = schema ? { schema } : {};

        switch (method) {
          case 'GET':
            app.get(path, routeOptions, (request, reply) =>
              handler(request as any, reply as any, app),
            );
            break;
          case 'POST':
            app.post(path, routeOptions, (request, reply) =>
              handler(request as any, reply as any, app),
            );
            break;
          case 'PUT':
            app.put(path, routeOptions, (request, reply) =>
              handler(request as any, reply as any, app),
            );
            break;
          case 'DELETE':
            app.delete(path, routeOptions, (request, reply) =>
              handler(request as any, reply as any, app),
            );
            break;
          case 'PATCH':
            app.patch(path, routeOptions, (request, reply) =>
              handler(request as any, reply as any, app),
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
    routes: buildRoutes(items),
  };
}

// * Factory function to create route builders
export function createRoute<TSchema = any>(
  path: string,
  method: Builder['method'],
  handler: Handler<TSchema>,
  schema?: TSchema,
): Builder<TSchema> {
  return { path, method, schema, handler };
}

// * Function to register modules to Fastify instance
export const registerModule = (app: FastifyInstance, mod: Module) => {
  app.register(
    async (subApp) => {
      mod.routes.forEach((route: Route) => route(subApp));
    },
    { prefix: mod.prefix },
  );
};

// * Function to register multiple modules
export const registerModules = (server: FastifyInstance, modules: readonly Module[]) => {
  modules.forEach((mod) => registerModule(server, mod));
};
