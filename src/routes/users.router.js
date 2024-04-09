import { Router } from 'express';
import { listUsers } from '../controllers/users.controller.js';

const router = Router();

/** GET
 *  /api/users
 */
router.get('/', listUsers);

export default router;
