import { prisma } from '../config/prisma.js';
import nodemailer from 'nodemailer';

export const createReminder = async (req, res, next) => {
  try {
    const { taskId, message, scheduledAt, reminderType } = req.body;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    // Save reminder to DB first
    const reminder = await prisma.reminder.create({
      data: {
        taskId,
        message: message || task.title,
        scheduledAt: new Date(scheduledAt),
        reminderType: reminderType || 'email'
      }
    });

    let emailPreviewUrl = null;

    try {
      // 1. Generate a test SMTP service account from ethereal.email (perfect for demos!)
      // This dynamically creates an inbox on the fly without needing API keys.
      const testAccount = await nodemailer.createTestAccount();

      // 2. Create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      // 3. Construct a beautiful HTML email
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2b2d42;">LifeSort Reminder 🗓️</h1>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin-top: 0; color: #1a1a24;">${task.title}</h2>
            <p style="color: #4a4a5a; font-size: 16px;">${message || task.description || 'You have a scheduled reminder.'}</p>
          </div>
          <div style="text-align: center; color: #8d90a0; font-size: 12px;">
            <p>This email was sent securely via LifeSort's automated systems.</p>
          </div>
        </div>
      `;

      // 4. Send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"LifeSort Assistant" <assistant@lifesort.app>', // sender address
        to: req.user.email, // list of receivers
        subject: `Reminder: ${task.title}`, // Subject line
        html: htmlBody, // html body
      });

      // 5. Get the preview URL
      emailPreviewUrl = nodemailer.getTestMessageUrl(info);
      console.log('===================================================');
      console.log('📧 DEMO EMAIL SENT!');
      console.log(`Click this link to view the email: ${emailPreviewUrl}`);
      console.log('===================================================');
      
    } catch (emailError) {
      console.error('Failed to send dummy email:', emailError);
    }
    
    res.status(201).json({ 
      status: 'success', 
      data: { 
        ...reminder, 
        emailPreviewUrl 
      } 
    });
  } catch (error) {
    next(error);
  }
};
