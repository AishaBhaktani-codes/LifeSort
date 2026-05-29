import { prisma } from '../config/prisma.js';
import { TEEService } from '../services/teeService.js';

export const uploadConversation = async (req, res, next) => {
  try {
    // 1. Receive audio file
    // 2. Whisper STT
    // 3. LLM Orchestration
    // 4. Save to DB with TEE Encryption
    res.status(201).json({ message: 'Conversation processed successfully (Mock)' });
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: conversations });
  } catch (error) {
    next(error);
  }
};

export const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await prisma.conversation.findUnique({
      where: { id, userId: req.user.id }
    });

    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    res.status(200).json({ status: 'success', data: conversation });
  } catch (error) {
    next(error);
  }
};
