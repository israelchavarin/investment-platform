import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import validateSchema from '../middlewares/validateSchema.middleware.js';
import { registerSchema, loginSchema } from './validations/auth.schema.js';

const router = Router();

/** POST
 *  /api/auth/register
 */
router.post('/register', validateSchema(registerSchema), register);

/** POST
 *  /api/auth/login
 */
router.post('/login', validateSchema(loginSchema), login);

export default router;
