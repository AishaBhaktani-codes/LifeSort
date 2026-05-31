import { prisma } from '../config/prisma.js';
import { google } from 'googleapis';

export const createReminder = async (req, res, next) => {
  try {
    const { taskId, message, scheduledAt, reminderType } = req.body;
    const providerToken = req.headers['x-provider-token'];

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    let googleEventLink = null;

    if (providerToken) {
      try {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: providerToken });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        
        const startTime = new Date(scheduledAt);
        // Default to a 15-minute event block
        const endTime = new Date(startTime.getTime() + 15 * 60000);

        const event = {
          summary: `LifeSort: ${task.title}`,
          description: message || task.description || 'Reminder from LifeSort.',
          start: {
            dateTime: startTime.toISOString(),
          },
          end: {
            dateTime: endTime.toISOString(),
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 10 },
            ],
          },
        };

        const response = await calendar.events.insert({
          calendarId: 'primary',
          resource: event,
        });
        
        googleEventLink = response.data.htmlLink;
        console.log(`Created Google Calendar event: ${googleEventLink}`);
      } catch (googleError) {
        console.error('Failed to create Google Calendar event:', googleError.message);
        // We'll continue and still save the reminder in the database
      }
    } else {
      console.warn('No x-provider-token provided. Cannot sync with Google Calendar.');
    }

    const reminder = await prisma.reminder.create({
      data: {
        taskId,
        message: message || task.title,
        scheduledAt: new Date(scheduledAt),
        reminderType: reminderType || 'task'
      }
    });
    
    res.status(201).json({ 
      status: 'success', 
      data: { 
        ...reminder, 
        googleEventLink 
      } 
    });
  } catch (error) {
    next(error);
  }
};
