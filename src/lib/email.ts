import * as brevo from '@getbrevo/brevo';

// Initialize Brevo API instance
const apiInstance = new brevo.TransactionalEmailsApi();
// Set the API key correctly
(apiInstance as any).authentications.apiKey.apiKey = process.env.BREVO_API_KEY || '';

interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export async function sendEmail({ to, subject, htmlContent, textContent }: SendEmailParams): Promise<boolean> {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY is not defined in environment variables');
      return false;
    }

    const sender = {
      email: process.env.EMAIL_FROM || 'noreply@bulletin.com',
      name: process.env.EMAIL_FROM_NAME || 'Bulletin App',
    };

    const receivers = [{ email: to }];

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = sender;
    sendSmtpEmail.to = receivers;
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    
    if (textContent) {
      sendSmtpEmail.textContent = textContent;
    }

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generatePasswordResetEmail(email: string, resetToken: string): { html: string; text: string } {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">Reset Your Password</h2>
      <p>Hello,</p>
      <p>You requested to reset your password. Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
      </div>
      <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
      <p>This link is valid for 1 hour.</p>
      <p>Regards,<br>The Bulletin Team</p>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
      <p style="font-size: 12px; color: #666;">If you're having trouble clicking the button, copy and paste this URL into your web browser: <a href="${resetUrl}" style="color: #4F46E5;">${resetUrl}</a></p>
    </div>
  `;
  
  const text = `
    Reset Your Password
    
    Hello,
    
    You requested to reset your password. Please visit the following link to set a new password:
    
    ${resetUrl}
    
    If you didn't request this, please ignore this email or contact support if you have concerns.
    
    This link is valid for 1 hour.
    
    Regards,
    The Bulletin Team
  `;
  
  return { html, text };
} 