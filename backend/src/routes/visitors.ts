import { Router } from 'express';
import { getAllVisitors, createVisitor, checkOutVisitor } from '../controllers/visitors';
import { requireRole } from '../middleware/auth';

const router = Router();

router.get('/', requireRole('ADMIN', 'SECURITY', 'RESIDENT'), getAllVisitors);
router.post('/', requireRole('ADMIN', 'SECURITY'), createVisitor);
router.patch('/:id/checkout', requireRole('ADMIN', 'SECURITY'), checkOutVisitor);

export default router;
