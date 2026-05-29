import { prisma } from '../config/prisma.js';
import { TEEService } from '../services/teeService.js';
import { transcribeAudio } from '../services/whisperService.js';
import { llmOrchestrator } from '../services/llmOrchestrator.js';
import fs from 'fs';

export const uploadConversation = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Since we're using memoryStorage in Multer (for MVP simplicity without external buckets),
    // we need to temporarily write to disk for OpenAI API or switch to Buffer uploads.
    // For now, write a temp file.
    const tempFilePath = `/tmp/${req.user.id}_${Date.now()}.m4a`;
    fs.writeFileSync(tempFilePath, req.file.buffer);

    // 1. Whisper STT
    const transcript = await transcribeAudio(tempFilePath);
    
    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    // 2. LLM Orchestration
    const aiResult = await llmOrchestrator.processConversation(transcript);

    // 3. Save to DB with TEE Encryption
    const { encrypted: encryptedTranscript } = await TEEService.secureProcess(
      req.user.id, 
      req.user.encryptionSalt, 
      transcript, 
      (data) => data // Identity function, we just want the encryption part
    );

    // Create tasks
    const tasks = aiResult.entities.tasks || [];
    
    // Create the conversation in DB
    const conversation = await prisma.conversation.create({
      data: {
        userId: req.user.id,
        flowType: 'brain_dump',
        encryptedTranscript: Buffer.from(encryptedTranscript), // Store encrypted text
        overallSentiment: parseFloat(aiResult.emotions.score),
        categories: aiResult.entities.categories || [],
        
        // Nested creates
        tasks: {
          create: tasks.map(t => ({
            userId: req.user.id,
            title: t.title,
            description: t.description,
            priority: t.priority || 'medium',
            dueDate: t.dueDate ? new Date(t.dueDate) : null
          }))
        },
        moodEntries: {
          create: {
            userId: req.user.id,
            score: parseFloat(aiResult.emotions.score),
            emotions: aiResult.emotions.emotions,
            triggers: aiResult.emotions.triggers,
            notes: aiResult.emotions.notes
          }
        }
      },
      include: { tasks: true, moodEntries: true }
    });

    res.status(201).json({ 
      status: 'success', 
      data: {
        conversation: { id: conversation.id, categories: conversation.categories },
        assistantResponse: aiResult.assistantResponse,
        tasksCreated: conversation.tasks.length,
        moodRecorded: aiResult.emotions
      } 
    });
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
