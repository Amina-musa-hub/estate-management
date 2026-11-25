import { Router } from 'express';
import { getAllApartments, createApartment } from '../controllers/apartments';
import { requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getAllApartments);
router.post('/', requireRole('ADMIN'), createApartment);

export default router;
