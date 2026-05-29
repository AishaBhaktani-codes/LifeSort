import express from 'express';
import { syncUser } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// The client authenticates via Supabase directly (Google OAuth)
// This route is called after successful login to sync the user profile into our DB
router.post('/sync', authMiddleware, syncUser);

export default router;
