import crypto from 'crypto';
import { prisma } from '../config/prisma.js';
import { supabaseAdmin } from '../config/supabase.js';

export const syncUser = async (req, res, next) => {
  try {
    const { user } = req; // user is attached by authMiddleware

    // Check if user already exists in our Prisma DB
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!dbUser) {
      // User is new, generate a salt for their TEE encryption key derivation
      const encryptionSalt = crypto.randomBytes(16).toString('hex');
      
      // Extract Google avatar if available from Supabase identity data
      const avatarUrl = user.user_metadata?.avatar_url || null;
      const displayName = user.user_metadata?.full_name || null;
      const googleId = user.app_metadata?.providers?.includes('google') ? user.id : null;

      dbUser = await prisma.user.create({
        data: {
          id: user.id, // Keep Supabase UUID and Prisma UUID in sync
          email: user.email,
          displayName,
          avatarUrl,
          googleId,
          encryptionSalt
        }
      });
    } else {
      // Update any metadata if changed (e.g. name or avatar)
      const avatarUrl = user.user_metadata?.avatar_url || dbUser.avatarUrl;
      const displayName = user.user_metadata?.full_name || dbUser.displayName;

      if (avatarUrl !== dbUser.avatarUrl || displayName !== dbUser.displayName) {
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: { avatarUrl, displayName }
        });
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          displayName: dbUser.displayName,
          avatarUrl: dbUser.avatarUrl
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
