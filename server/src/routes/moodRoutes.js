import express from 'express';
import { getMoodHistory, getMoodTrends } from '../controllers/moodController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMoodHistory);
router.get('/trends', getMoodTrends);

export default router;
