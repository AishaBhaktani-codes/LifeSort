import express from 'express';
import { getTasks, updateTask } from '../controllers/taskController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.patch('/:id', updateTask);

export default router;
