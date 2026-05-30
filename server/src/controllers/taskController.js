import { prisma } from '../config/prisma.js';

export const getTasks = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    
    const where = { userId: req.user.id };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, title, dueDate } = req.body;

    const task = await prisma.task.findUnique({ where: { id } });
    
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status, title, dueDate }
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};
