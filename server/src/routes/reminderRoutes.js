import express from 'express';
import { createReminder } from '../controllers/reminderController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createReminder);

export default router;
