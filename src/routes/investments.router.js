import { Router } from 'express';
import { invest } from '../controllers/investments.controller.js';
import validateSchema from '../middlewares/validateSchema.middleware.js';
import investmentSchema from './validations/investments.schema.js';
import authenticate from '../middlewares/authenticate.middleware.js';

const router = Router();

/** POST
 *  /api/investments/invest
 */
router.post('/invest', authenticate, validateSchema(investmentSchema), invest);

export default router;
