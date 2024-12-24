import type { Router } from '~/interfaces/types';

import root from './routes/root';

const TemplateRouter: Router = {
  prefix: '/template',
  routes: [root],
};

export default TemplateRouter;
