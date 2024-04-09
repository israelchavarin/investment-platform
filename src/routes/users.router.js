import { Router } from 'express';
import {
  listUsers, updateUser, deposit, withdraw,
} from '../controllers/users.controller.js';
import validateSchema from '../middlewares/validateSchema.middleware.js';
import { updateUserDataSchema, manageBalanceSchema } from './validations/user.schema.js';
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

/** PATCH
 *  /api/users/update/:id/deposit
 */
router.patch('/update/:id/deposit', authenticate, validateSchema(manageBalanceSchema), deposit);

/** PATCH
 *  /api/users/update/:id/withdraw
 */
router.patch('/update/:id/withdraw', authenticate, validateSchema(manageBalanceSchema), withdraw);

export default router;
