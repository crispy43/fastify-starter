import { FastifyHelmetOptions } from '@fastify/helmet';
import type { FastifyDynamicSwaggerOptions } from '@fastify/swagger';

import { SwaggerTags } from './constants/app';
import { Router } from './interfaces/types';
import HealthRouter from './routers/health/router';
import TemplateRouter from './routers/template/router';

// * Routers
// TODO: 라우터 모듈 추가시 ROUTERS 배열에 포함
export const ROUTERS: Router[] = [HealthRouter, TemplateRouter] as const;

// * Helmet 옵션
// https://github.com/fastify/fastify-helmet#readme
export const HELMET: FastifyHelmetOptions = { contentSecurityPolicy: false } as const;

// * Swagger 옵션
// https://github.com/fastify/fastify-swagger#readme
export const SWAGGER: FastifyDynamicSwaggerOptions = {
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
};
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
