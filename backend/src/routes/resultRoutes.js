import { Router } from 'express';
import { submitResult, listResults, getResult } from '../controllers/resultController.js';
import { requireAdminKey } from '../middleware/adminAuth.js';
const router = Router();
router.post('/', submitResult);
router.get('/', requireAdminKey, listResults);
router.get('/:id', getResult);
export default router;
