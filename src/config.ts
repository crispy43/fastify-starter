import type { FastifyDynamicSwaggerOptions } from '@fastify/swagger';

import { SwaggerTags } from './constants/app';
import HealthRouter from './routers/health';
import TemplateRouter from './routers/template';

// * Routers
export const ROUTERS = [HealthRouter, TemplateRouter] as const;

// * Helmet 옵션
export const HELMET = { contentSecurityPolicy: false } as const;

// * Swagger 옵션
export const SWAGGER = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Fastify Starter',
      description: 'Fastify Starter API Documentation',
      version: '0.1.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Localhost server',
      },
    ],
    tags: [{ name: SwaggerTags.ETC, description: '기타' }],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
  },
} as FastifyDynamicSwaggerOptions;

export const SWAGGER_UI = {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest(_, __, next) {
      next();
    },
    preHandler(_, __, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, _, __) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
} as const;
