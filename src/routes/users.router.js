import { Router } from 'express';
import { listUsers, updateUser } from '../controllers/users.controller.js';
import validateSchema from '../middlewares/validateSchema.middleware.js';
import { updateUserDataSchema } from './validations/user.schema.js';
import authenticate from '../middlewares/authenticate.middleware.js';

const router = Router();

/** GET
 *  /api/users
 */
router.get('/', listUsers);

/** PATCH
 *  /api/users/update/:id
 */
router.patch('/update/:id', authenticate, validateSchema(updateUserDataSchema), updateUser);

export default router;
