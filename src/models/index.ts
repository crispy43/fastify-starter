import { db } from '~/lib/mongodb';

import userSchema, { User } from './user';

// TODO: 모델 파일 추가시 해당 모델 임포트하여 mongoose 모델로 선언

// Example: User model
export const UserModel = db.models.User || db.model<User>('User', userSchema);
