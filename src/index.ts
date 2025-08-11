import 'dotenv/config';

import helmet from '@fastify/helmet';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';

import { HELMET, LOGGER, MODULES, SWAGGER, SWAGGER_UI } from './config';
import { HttpException } from './lib/exceptions';
import { redisDbs } from './lib/redis';
import utils, { env } from './lib/utils';

utils();

const start = async () => {
  const server = Fastify({
    logger: LOGGER,
    ajv: {
      customOptions: {
        allErrors: true,
        coerceTypes: false,
      },
    },
  });

  server.register(helmet, HELMET);
  await server.register(fastifySwagger, SWAGGER);
  await server.register(fastifySwaggerUi, SWAGGER_UI);

  MODULES.forEach(({ prefix, routes }) => {
    server.register(
      async (app: FastifyInstance) => routes.forEach((route) => route(app)),
      { prefix },
    );
  });

  // * Set error handler
  server.setErrorHandler((error, request, reply) => {
    if (error.validation) {
      request.log.error(
        {
          validation: error.validation,
          validationContext: error.validationContext,
        },
        'Validation error occurred',
      );
      return reply.status(400).send({
        message: error.message,
        path: error.validation[0],
      });
    }
    if (error.name === 'ValidationError') {
      request.log.error(
        {
          validation: error.validation,
          validationContext: error.validationContext,
        },
        error.message,
      );
      return reply.status(400).send({
        message: error.message,
        path: error.validation[0],
      });
    }
    if (error instanceof HttpException) {
      request.log.error(
        {
          error: {
            name: error.constructor.name,
            message: error.message,
            path: error.path,
            status: error.status,
            stack: error.stack,
          },
          request: {
            method: request.method,
            url: request.url,
            headers: request.headers,
            body: request.body,
          },
        },
        `${error.constructor.name}: ${error.message}`,
      );
      return reply.status(error.status).send({
        message: error.message,
        ...(error.path && { path: error.path }),
      });
    }
    request.log.error(
      {
        error: {
          name: error.constructor.name,
          message: error.message,
          stack: error.stack,
        },
        request: {
          method: request.method,
          url: request.url,
          headers: request.headers,
          body: request.body,
        },
      },
      `${error.constructor.name}: ${error.message}`,
    );
    return reply.status(500).send({
      message: 'Something went wrong',
    });
  });

  // * Graceful shutdown
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, async () => {
      try {
        await Promise.all(Object.values(redisDbs).map((redis) => redis.quit()));
        await server.close();
        server.log.error(`Closed application on ${signal}`);
        process.exit(0);
      } catch (error) {
        server.log.error(`Error closing application on ${signal}`, error);
        process.exit(1);
      }
    });
  });

  try {
    const port = parseInt(env('PORT', '3000'));
    await server.listen({ port });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// * Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

start();
