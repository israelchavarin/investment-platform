import {
  Router,
} from 'express';

import authRoutes from './auth.router.js';
import opportunityRoutes from './opportunities.router.js';
import investmentRoutes from './investments.router.js';

function mainRouter(app) {
  const router = Router();

  router.use('/auth', authRoutes);
  router.use('/opportunities', opportunityRoutes);
  router.use('/investments', investmentRoutes);

  app.use('/api', router);
}

export default mainRouter;
