import { prisma } from '../config/prisma.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        preferences: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { displayName, preferences } = req.body;
    
    // Merge new preferences with existing ones, or replace them
    // Ensure it's a valid JSON object if provided
    let updatedPreferences = undefined;
    if (preferences && typeof preferences === 'object') {
      updatedPreferences = preferences;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(updatedPreferences !== undefined && { preferences: updatedPreferences })
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        preferences: true,
        createdAt: true,
      }
    });

    res.status(200).json({ status: 'success', data: updatedUser });
  } catch (error) {
    next(error);
  }
};
