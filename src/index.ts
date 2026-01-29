import 'dotenv/config';

import helmet from '@fastify/helmet';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyError, FastifyInstance } from 'fastify';
import Fastify from 'fastify';

import { HELMET, LOGGER, MODULES, SWAGGER, SWAGGER_UI } from './config';
import ErrorLogModel from './db/mongoose/models/error-log';
import { setPrisma } from './db/prisma/prisma';
import { quitAllRedis } from './db/redis/redis';
import { HttpException } from './lib/exceptions';
import utils, { env } from './lib/utils';
import prismaPlugin from './plugins/prisma-plugin';

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
  server.register(prismaPlugin).after(() => {
    setPrisma(server.prisma);
  });
  await server.register(fastifySwagger, SWAGGER);
  await server.register(fastifySwaggerUi, SWAGGER_UI);

  MODULES.forEach(({ prefix, routes }) => {
    server.register(
      async (app: FastifyInstance) => routes.forEach((route) => route(app)),
      { prefix },
    );
  });

  // * Set error handler
  server.setErrorHandler(async (error: FastifyError, request, reply) => {
    if (error.validation?.length) {
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
    await ErrorLogModel().create({
      message: error.message,
      name: error.constructor.name,
      stack: error.stack,
    });
    return reply.status(500).send({
      message: 'Something went wrong',
    });
  });

  // * Graceful shutdown
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, async () => {
      try {
        await quitAllRedis();
        await server.close();
        server.log.info(`Closed application on ${signal}`);
        process.exit(0);
      } catch (error) {
        server.log.error(error, `Error closing application on ${signal}`);
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
