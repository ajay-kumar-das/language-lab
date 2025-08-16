import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      const config: EmailConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || ''
        }
      };

      if (!config.auth.user || !config.auth.pass) {
        logger.warn('Email service not configured. SMTP_USER and SMTP_PASS environment variables are required.');
        return;
      }

      this.transporter = nodemailer.createTransport(config);
      this.isConfigured = true;
      
      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      logger.warn('Email service not configured, skipping email send');
      return false;
    }

    try {
      const mailOptions = {
        from: `"LinguaLeap" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html)
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string, firstName: string): Promise<boolean> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/auth/verify-email?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: white; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to LinguaLeap!</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Thank you for joining LinguaLeap, your AI-powered language learning companion.</p>
            <p>To complete your registration and start your language learning journey, please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
            <p>This verification link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account with LinguaLeap, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 LinguaLeap. All rights reserved.</p>
            <p>Happy learning!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Verify your LinguaLeap account',
      html
    });
  }

  async sendPasswordResetEmail(email: string, token: string, firstName: string): Promise<boolean> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: white; }
          .button { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>We received a request to reset your password for your LinguaLeap account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <div class="warning">
              <strong>Important:</strong> This password reset link will expire in 1 hour for security reasons.
            </div>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>For security reasons, if you continue to receive these emails, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 LinguaLeap. All rights reserved.</p>
            <p>Keep your account secure!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset your LinguaLeap password',
      html
    });
  }

  async sendPasswordResetConfirmation(email: string, firstName: string): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: white; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 15px 0; color: #155724; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Successfully Reset</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <div class="success">
              <strong>Success!</strong> Your LinguaLeap password has been successfully reset.
            </div>
            <p>You can now log in to your account using your new password.</p>
            <p>If you didn't make this change, please contact our support team immediately.</p>
            <p>Continue your language learning journey at LinguaLeap!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 LinguaLeap. All rights reserved.</p>
            <p>Happy learning!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'LinguaLeap password reset confirmation',
      html
    });
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  async testConnection(): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      logger.info('Email service connection test successful');
      return true;
    } catch (error) {
      logger.error('Email service connection test failed:', error);
      return false;
    }
  }

  isReady(): boolean {
    return this.isConfigured;
  }
}

const emailService = new EmailService();
export default emailService;