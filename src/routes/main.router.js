import {
  Router,
} from 'express';

import authRoutes from './auth.router.js';

function mainRouter(app) {
  const router = Router();

  router.use('/auth', authRoutes);

  app.use('/api', router);
}

export default mainRouter;
