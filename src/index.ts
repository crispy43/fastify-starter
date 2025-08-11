import 'dotenv/config';

import helmet from '@fastify/helmet';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';

import { ErrorCode } from './common/server';
import { HELMET, LOGGER, MODULES, SWAGGER, SWAGGER_UI } from './config';
import { redisDbs } from './lib/redis';
import utils, { env } from './lib/utils';

utils();

const start = async () => {
  const server = Fastify({
    logger: LOGGER,
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
  server.setErrorHandler((error, _, reply) => {
    console.error(error);
    if (error.validation) {
      return reply.status(400).send({
        message: error.message,
        error: ErrorCode.BAD_REQUEST,
        statusCode: 400,
        validations: error.validation,
      });
    }
    return reply.status(500).send({
      message: 'Something went wrong',
      error: ErrorCode.INTERNAL_SERVER_ERROR,
      statusCode: 500,
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
