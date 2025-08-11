import { createModule, createRoute } from '~/lib/module-factory';

import { handleCreateUser, handleGetUser } from './handlers/user-handler';
import { createUserSchema, getUserSchema } from './schemas/user-schema';

// TODO: 라우트 추가시 createRoute로 추가
const TemplateModule = createModule({ prefix: '/user' }, [
  createRoute('/', 'GET', handleGetUser, getUserSchema),
  createRoute('/', 'POST', handleCreateUser, createUserSchema),
]);

export default TemplateModule;
