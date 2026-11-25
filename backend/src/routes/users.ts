import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/users';
import { requireRole } from '../middleware/auth';

const router = Router();

router.get('/', requireRole('ADMIN'), getAllUsers);
router.post('/', requireRole('ADMIN'), createUser);

export default router;
