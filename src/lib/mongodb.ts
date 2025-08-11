/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-var */
import type { Schema } from 'mongoose';
import mongoose from 'mongoose';
import mongooseToJsonSchema from 'mongoose-schema-jsonschema';

import { ToJson } from '~/common/types';

import { env } from './utils';
mongooseToJsonSchema(mongoose);

declare module 'mongoose' {
  interface Schema {
    toJSON(): ToJson<this>;
    jsonSchema(): Record<string, any>;
  }
}

const MONGODB_URI = env('MONGODB_URI');

// * MongoDB 연결 옵션
const connectionOptions = {
  bufferCommands: true,
  authSource: 'admin',
  // replicaSet: 'rs0',
};

// TODO: DB에 따라 enum 설정
export enum MongoDB {
  DB = 'db',
}

// TODO: 기본 DB 설정
const DEFAULT_DB = MongoDB.DB;

// * Mongoose Connections
export const connections = {
  [MongoDB.DB]: mongoose.createConnection(
    `${MONGODB_URI}/${MongoDB.DB}`,
    connectionOptions,
  ),
};

// * 모델 생성 함수
export const generateModel = <T>(dbs: MongoDB[], modelName: string, schema: Schema) => {
  const models: { [key in MongoDB]?: mongoose.Model<T> } & {
    getModel?: (db?: MongoDB) => mongoose.Model<T, {}, {}, {}, T, any>;
  } = {};
  dbs.forEach((db) => {
    if (!connections[db]) {
      throw new Error(`Connection for ${db} does not exist.`);
    }
    models[db] =
      connections[db].models[modelName] || connections[db].model<T>(modelName, schema);
  });
  models.getModel = (db: MongoDB = DEFAULT_DB) => {
    if (!models[db]) {
      throw new Error(`Model for ${modelName} in ${db} does not exist.`);
    }
    return models[db];
  };
  return models;
};
