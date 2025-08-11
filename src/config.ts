import type { FastifyHelmetOptions } from '@fastify/helmet';
import type { FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { FastifyLoggerOptions } from 'fastify';
import { PinoLoggerOptions } from 'fastify/types/logger';

import { SwaggerTag } from './constants/server';
import type { Module } from './interfaces/types';
import { getEnv } from './lib/utils';
import HealthRouter from './modules/health/module';
import TemplateRouter from './modules/template/module';

// * Modules
// TODO: 모듈 추가시 ROUTERS 배열에 포함
export const MODULES: Module[] = [HealthRouter, TemplateRouter] as const;

// * Logger 옵션
// https://github.com/pinojs/pino#readme
export const LOGGER: FastifyLoggerOptions & PinoLoggerOptions = {
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
};

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
    // TODO: 서버 URL 추가시 servers 배열에 포함
    servers: [
      {
        url: `http://localhost:${getEnv('PORT', '3000')}`,
        description: 'Localhost server',
      },
    ],
    // TODO: 스웨거 태그 추가시 tags 배열에 포함
    tags: [{ name: SwaggerTag.ETC, description: '기타' }],
    components: {
      // TODO: Auth 인증 추가시 securitySchemes에 추가
      // 각 라우트 스키마에 security 속성 추가시 적용
      securitySchemes: {
        // bearerAuth: {
        //   type: 'http',
        //   scheme: 'bearer',
        // },
      },
    },
  },
};
export const SWAGGER_UI: FastifySwaggerUiOptions = {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'list',
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
