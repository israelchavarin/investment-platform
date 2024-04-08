import { Router } from 'express';
import { createOpportunity, invest } from '../controllers/opportunities.controller.js';
import validateSchema from '../middlewares/validateSchema.middleware.js';
import { opportunityCreationSchema, investmentSchema } from './validations/opportunities.schema.js';
import authenticate from '../middlewares/authenticate.middleware.js';

const router = Router();

/** POST
 *  /api/opportunities/create
 */
router.post('/create', validateSchema(opportunityCreationSchema), createOpportunity);

/** POST
 *  /api/opportunities/invest
 */
router.post('/invest', authenticate, validateSchema(investmentSchema), invest);

export default router;
