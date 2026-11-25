import { Router } from 'express';
import { getAllAnnouncements, createAnnouncement } from '../controllers/announcements';
import { requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getAllAnnouncements);
router.post('/', requireRole('ADMIN'), createAnnouncement);

export default router;
