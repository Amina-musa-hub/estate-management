import { Router } from 'express';
import {getAllVisitors, createVisitor} from '../controllers/visitors';

const router = Router();

router.get('/',getAllVisitors);
router.post('/',createVisitor);

export default router;