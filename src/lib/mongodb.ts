/* eslint-disable no-var */
import type { Connection } from 'mongoose';
import mongoose from 'mongoose';
import mongooseToJsonSchema from 'mongoose-schema-jsonschema';

import { getEnv } from './utils';
mongooseToJsonSchema(mongoose);

declare module 'mongoose' {
  interface Schema {
    jsonSchema(): Record<string, any>;
  }
}

// * MongoDB Database
export enum Database {
  DB = 'db',
}

const MONGODB_URI = getEnv('MONGODB_URI');

export const db: Connection = mongoose.createConnection(MONGODB_URI + `/${Database.DB}`, {
  bufferCommands: false,
  authSource: 'admin', // 만약 인증 소스가 admin DB라면 추가
});
