import { Router } from 'express';
import { getAllResidents, createResident } from '../controllers/residents';
import { requireRole } from '../middleware/auth';

const router = Router();

router.get('/', requireRole('ADMIN', 'SECURITY'), getAllResidents);
router.post('/', requireRole('ADMIN'), createResident);

export default router;
