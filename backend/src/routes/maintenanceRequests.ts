import { Router } from 'express';
import {
  getAllMaintenanceRequests,
  createMaintenanceRequest,
  updateMaintenanceRequest,
} from '../controllers/maintenanceRequests';
import { requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getAllMaintenanceRequests);
router.post('/', requireRole('RESIDENT', 'ADMIN'), createMaintenanceRequest);
router.patch('/:id', requireRole('ADMIN', 'MAINTENANCE'), updateMaintenanceRequest);

export default router;
