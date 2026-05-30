import { prisma } from '../config/prisma.js';

export const getMoodHistory = async (req, res, next) => {
  try {
    const moods = await prisma.moodEntry.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to recent 50 for MVP
    });
    
    res.status(200).json(moods);
  } catch (error) {
    next(error);
  }
};

export const getMoodTrends = async (req, res, next) => {
  try {
    // In a real app, this would aggregate data by week/month
    // For MVP, just return recent moods
    const moods = await prisma.moodEntry.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 30
    });
    
    // Calculate simple average score
    const avgScore = moods.length > 0 
      ? moods.reduce((acc, m) => acc + m.score, 0) / moods.length 
      : 0;

    res.status(200).json({ 
      averageScore: avgScore,
      recentEntries: moods
    });
  } catch (error) {
    next(error);
  }
};
