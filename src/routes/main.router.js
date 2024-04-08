import {
  Router,
} from 'express';

import authRoutes from './auth.router.js';
import opportunityRoutes from './opportunities.router.js';

function mainRouter(app) {
  const router = Router();

  router.use('/auth', authRoutes);
  router.use('/opportunities', opportunityRoutes);

  app.use('/api', router);
}

export default mainRouter;
