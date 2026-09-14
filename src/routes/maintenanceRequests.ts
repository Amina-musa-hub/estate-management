import { Router } from 'express';
import { getAllMaintenanceRequests, createMaintenanceRequest } from '../controllers/maintenanceRequests';

const router = Router();

router.get('/', getAllMaintenanceRequests);
router.post('/',createMaintenanceRequest);

export default router;