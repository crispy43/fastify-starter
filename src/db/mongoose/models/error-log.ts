import type { Document } from 'mongoose';
import { Schema } from 'mongoose';

import { generateModel, MongoDB } from '~/db/mongoose/mongoose';

export interface ErrorLog extends Document {
  _id: Schema.Types.ObjectId;
  message: string;
  code?: string;
  name?: string;
  path?: string;
  stack?: any;
  createdAt: Date;
}

const errorLogSchema = new Schema<ErrorLog>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  message: { type: String, required: true },
  code: { type: String },
  name: { type: String },
  path: { type: String },
  stack: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

const models = generateModel<ErrorLog>([MongoDB.DB], 'ErrorLog', errorLogSchema);
const ErrorLogModel = models.getModel;

export default ErrorLogModel;
