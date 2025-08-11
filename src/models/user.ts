import type { Document } from 'mongoose';
import { Schema } from 'mongoose';

import { generateModel, MongoDB } from '~/lib/mongodb';

export interface User extends Document {
  _id: Schema.Types.ObjectId;
  email: string;
  name: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const models = generateModel<User>([MongoDB.DB], 'User', userSchema);
const UserModel = models.getModel;

export default UserModel;
