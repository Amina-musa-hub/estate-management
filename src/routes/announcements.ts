import { Router } from 'express';
import { getAllAnnouncements, createAnnouncement} from '../controllers/announcements';

const router = Router();

router.get('/', getAllAnnouncements);
router.post('/', createAnnouncement);

export default router;