import { Router } from 'express';
import { register } from '../controllers/auth.controller.js';
import validateSchema from '../middlewares/validateSchema.middleware.js';
import { registerSchema } from './validations/auth.schema.js';

const router = Router();

/** POST
 *  /api/auth/register
 */
router.post('/register', validateSchema(registerSchema), register);

export default router;
