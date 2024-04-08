import { Router } from 'express';
import { createOpportunity, listAllOpportunities, listActiveOpportunities } from '../controllers/opportunities.controller.js';
import validateSchema from '../middlewares/validateSchema.middleware.js';
import opportunityCreationSchema from './validations/opportunities.schema.js';
import authenticate from '../middlewares/authenticate.middleware.js';

const router = Router();

/** POST
 *  /api/opportunities/create
 */
router.post('/create', validateSchema(opportunityCreationSchema), createOpportunity);

/** GET
 *  /api/opportunities/all
 */
router.get('/all', listAllOpportunities);

/** GET
 *  /api/opportunities/active
 */
router.get('/active', authenticate, listActiveOpportunities);

export default router;
