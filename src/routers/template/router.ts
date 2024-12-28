import type { Router } from '~/interfaces/types';

import root from './routes/root';

// TODO: 라우트 추가시 routes 배열에 포함
const TemplateRouter: Router = {
  prefix: '/template',
  routes: [root],
};

export default TemplateRouter;
