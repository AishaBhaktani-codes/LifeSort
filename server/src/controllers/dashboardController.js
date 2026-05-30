import { prisma } from '../config/prisma.js';

export const getDashboard = async (req, res, next) => {
  try {
    const [sessionCount, moodAvg, pendingTasks] = await Promise.all([
      prisma.conversation.count({ where: { userId: req.user.id } }),
      prisma.moodEntry.aggregate({ where: { userId: req.user.id }, _avg: { score: true } }),
      prisma.task.count({ where: { userId: req.user.id, status: 'pending' } }),
    ]);
    res.json({
      sessionCount,
      avgMoodScore: moodAvg._avg.score || 0,
      pendingTaskCount: pendingTasks,
    });
  } catch (error) {
    next(error);
  }
};
