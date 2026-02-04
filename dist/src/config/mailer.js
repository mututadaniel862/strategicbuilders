"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponseToClient = exports.sendContactEmailToAdmin = exports.testEmailConfig = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Create transporter instance
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'mututadaniel54@gmail.com',
        pass: 'qrgdzlgmsesxeuty'
    }
});
// Test email configuration
const testEmailConfig = async () => {
    try {
        console.log('📧 Testing email configuration...');
        console.log('Host: smtp.gmail.com');
        console.log('User: mututadaniel54@gmail.com');
        await transporter.verify();
        console.log('✅ Email configuration is valid');
        return true;
    }
    catch (error) {
        console.error('❌ Email configuration error:', error.message);
        console.log('⚠️  Make sure:');
        console.log('1. You enabled "Less secure apps" in Google Account');
        console.log('2. Or created an "App Password" for your Gmail account');
        console.log('3. Email and password are correct');
        return false;
    }
};
exports.testEmailConfig = testEmailConfig;
// Send contact email to admin
const sendContactEmailToAdmin = async (name, email, message, phone) => {
    try {
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          .info-item { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Contact Form Submission</h1>
          </div>
          
          <div class="content">
            <div class="info-item">
              <span class="label">👤 Name:</span> ${name}
            </div>
            <div class="info-item">
              <span class="label">📧 Email:</span> <a href="mailto:${email}">${email}</a>
            </div>
            ${phone ? `<div class="info-item"><span class="label">📞 Phone:</span> <a href="tel:${phone}">${phone}</a></div>` : ''}
            <div class="info-item">
              <span class="label">📅 Date:</span> ${new Date().toLocaleString()}
            </div>
            
            <hr style="margin: 20px 0;">
            
            <div class="info-item">
              <span class="label">💬 Message:</span>
              <div style="margin-top: 10px; padding: 15px; background: white; border-left: 4px solid #4CAF50;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>This message was sent from your website contact form.</p>
            <p>To reply, click "Reply" in your email client.</p>
            <p>© ${new Date().getFullYear()} Strategic Builders. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        const info = await transporter.sendMail({
            from: '"Strategic Builders" <mututadaniel54@gmail.com>',
            to: 'mututadaniel54@gmail.com',
            subject: `📬 New Contact: ${name}`,
            html: htmlContent,
            text: `
        New Contact Form Submission
        ============================
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        Date: ${new Date().toLocaleString()}
        
        Message:
        ${message}
        
        ---
        This message was sent from your website contact form.
      `
        });
        console.log('✅ Contact email sent to admin');
        console.log('📧 Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        console.error('❌ Error sending contact email:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
};
exports.sendContactEmailToAdmin = sendContactEmailToAdmin;
// Send response email to client
const sendResponseToClient = async (clientEmail, clientName, adminMessage) => {
    try {
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          .message-box { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👋 Hello ${clientName},</h1>
            <p>Thank you for contacting us!</p>
          </div>
          
          <div class="content">
            <p>We have received your message and here is our response:</p>
            
            <div class="message-box">
              ${adminMessage.replace(/\n/g, '<br>')}
            </div>
            
            <p>If you have any further questions, feel free to reply to this email.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>Strategic Builders</strong><br>
              <a href="mailto:mututadaniel54@gmail.com">mututadaniel54@gmail.com</a><br>
              <a href="tel:+263774312992">+263 77 431 2992</a>
            </p>
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email.</p>
            <p>© ${new Date().getFullYear()} Strategic Builders. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        const info = await transporter.sendMail({
            from: '"Strategic Builders" <mututadaniel54@gmail.com>',
            to: clientEmail,
            subject: `Re: Your Contact Form Submission`,
            html: htmlContent,
            text: `
        Hello ${clientName},
        
        Thank you for contacting us. Here is our response:
        
        ${adminMessage}
        
        If you have any further questions, please reply to this email.
        
        Best regards,
        Strategic Builders
        mututadaniel54@gmail.com
        +263 77 431 2992
      `
        });
        console.log(`✅ Response email sent to ${clientEmail}`);
        console.log('📧 Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        console.error('❌ Error sending response email:', error.message);
        throw error;
    }
};
exports.sendResponseToClient = sendResponseToClient;
exports.default = transporter;
