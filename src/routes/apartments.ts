import { Router } from 'express';
import { getAllApartments, createApartment } from '../controllers/apartments';

const router = Router();

router.get('/', getAllApartments);
router.post('/', createApartment);

export default router;