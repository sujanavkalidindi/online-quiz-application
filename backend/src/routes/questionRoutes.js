import { Router } from 'express';
import { updateQuestion, deleteQuestion } from '../controllers/quizController.js';
import { requireAdminKey } from '../middleware/adminAuth.js';
const router = Router();
router.put('/:id', requireAdminKey, updateQuestion);
router.delete('/:id', requireAdminKey, deleteQuestion);
export default router;
