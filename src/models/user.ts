import type { Document } from 'mongoose';
import { Schema } from 'mongoose';

import { generateModel, MongoDB } from '~/lib/mongodb';

export interface User extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const userJsonSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  required: ['_id', 'name', 'createdAt', 'updatedAt'],
} as const;

const models = generateModel<User>([MongoDB.DB], 'User', userSchema);
const UserModel = models.getModel;

export default UserModel;
