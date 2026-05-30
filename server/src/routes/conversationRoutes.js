import express from 'express';
import multer from 'multer';
import { uploadConversation, getConversations, getConversationById, deleteConversation } from '../controllers/conversationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

router.post('/', upload.single('audio'), uploadConversation);
router.get('/', getConversations);
router.get('/:id', getConversationById);
router.delete('/:id', deleteConversation);

export default router;
