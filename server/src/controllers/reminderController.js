import { prisma } from '../config/prisma.js';

export const createReminder = async (req, res, next) => {
  try {
    const { taskId, message, scheduledAt, reminderType } = req.body;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    const reminder = await prisma.reminder.create({
      data: {
        taskId,
        message,
        scheduledAt: new Date(scheduledAt),
        reminderType: reminderType || 'task'
      }
    });
    
    res.status(201).json({ status: 'success', data: reminder });
  } catch (error) {
    next(error);
  }
};
