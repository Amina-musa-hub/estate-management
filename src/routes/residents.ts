import { Router } from 'express';
import { getAllResidents, createResident } from '../controllers/residents';

const router = Router();

router.get('/', getAllResidents);
router.post('/', createResident);

export default router;