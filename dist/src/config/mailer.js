import nodemailer from 'nodemailer';
// Create test account or use real credentials
const createMailer = async () => {
    // HARDCODED FOR TESTING - REMOVE LATER
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'mututadaniel54@gmail.com',
            pass: 'qrgdzlgmsesxeuty'
        }
    });
};
const mailer = await createMailer();
// Test email configuration
export const testEmailConfig = async () => {
    try {
        console.log('📧 Testing email configuration...');
        console.log('Host: smtp.gmail.com');
        console.log('User: mututadaniel54@gmail.com');
        await mailer.verify();
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
// Send contact email to admin
export const sendContactEmailToAdmin = async (name, email, message, phone) => {
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
        const info = await mailer.sendMail({
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
// Send response email to client
export const sendResponseToClient = async (clientEmail, clientName, adminMessage) => {
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
        const info = await mailer.sendMail({
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
export default mailer;
// import nodemailer from 'nodemailer';
// // Create test account or use real credentials
// const createMailer = async () => {
//   if (process.env.NODE_ENV === 'development' && !process.env.JSM_SMTP_USER) {
//     // Generate test SMTP service account from ethereal.email
//     const testAccount = await nodemailer.createTestAccount();
//     return nodemailer.createTransport({
//       host: 'smtp.ethereal.email',
//       port: 587,
//       secure: false,
//       auth: {
//         user: testAccount.user,
//         pass: testAccount.pass
//       }
//     });
//   }
//   // Use real credentials
//   return nodemailer.createTransport({
//     host: process.env.JSM_SMTP_HOST!,
//     port: parseInt(process.env.JSM_SMTP_PORT!),
//     secure: false,
//     auth: {
//       user: process.env.JSM_SMTP_USER!,
//       pass: process.env.JSM_SMTP_PASS!
//     }
//   });
// };
// const mailer = await createMailer();
// // Test email configuration
// export const testEmailConfig = async (): Promise<boolean> => {
//   try {
//     console.log('📧 Testing email configuration...');
//     if (process.env.NODE_ENV === 'development' && !process.env.JSM_SMTP_USER) {
//       console.log('✅ Using Ethereal test email service');
//       console.log('📨 Emails will be caught at https://ethereal.email');
//       return true;
//     }
//     console.log(`Host: ${process.env.JSM_SMTP_HOST}`);
//     console.log(`User: ${process.env.JSM_SMTP_USER}`);
//     await mailer.verify();
//     console.log('✅ Email configuration is valid');
//     return true;
//   } catch (error: any) {
//     console.error('❌ Email configuration error:', error.message);
//     console.log('⚠️  Make sure:');
//     console.log('1. You enabled "Less secure apps" in Google Account');
//     console.log('2. Or created an "App Password" for your Gmail account');
//     console.log('3. Email and password are correct');
//     return false;
//   }
// };
// // Send contact email to admin
// export const sendContactEmailToAdmin = async (
//   name: string,
//   email: string,
//   message: string,
//   phone?: string
// ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
//   try {
//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
//           .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
//           .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
//           .info-item { margin: 10px 0; }
//           .label { font-weight: bold; color: #555; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>📬 New Contact Form Submission</h1>
//           </div>
//           <div class="content">
//             <div class="info-item">
//               <span class="label">👤 Name:</span> ${name}
//             </div>
//             <div class="info-item">
//               <span class="label">📧 Email:</span> <a href="mailto:${email}">${email}</a>
//             </div>
//             ${phone ? `<div class="info-item"><span class="label">📞 Phone:</span> <a href="tel:${phone}">${phone}</a></div>` : ''}
//             <div class="info-item">
//               <span class="label">📅 Date:</span> ${new Date().toLocaleString()}
//             </div>
//             <hr style="margin: 20px 0;">
//             <div class="info-item">
//               <span class="label">💬 Message:</span>
//               <div style="margin-top: 10px; padding: 15px; background: white; border-left: 4px solid #4CAF50;">
//                 ${message.replace(/\n/g, '<br>')}
//               </div>
//             </div>
//           </div>
//           <div class="footer">
//             <p>This message was sent from your website contact form.</p>
//             <p>To reply, click "Reply" in your email client.</p>
//             <p>© ${new Date().getFullYear()} Your Website. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//     const info = await mailer.sendMail({
//       from: `"${process.env.JSM_FROM_NAME || 'Website'}" <${process.env.JSM_FROM_EMAIL || 'noreply@test.com'}>`,
//       to: process.env.ADMIN_EMAIL || 'admin@test.com',
//       subject: `📬 New Contact: ${name}`,
//       html: htmlContent,
//       text: `
//         New Contact Form Submission
//         ============================
//         Name: ${name}
//         Email: ${email}
//         Phone: ${phone || 'Not provided'}
//         Date: ${new Date().toLocaleString()}
//         Message:
//         ${message}
//         ---
//         This message was sent from your website contact form.
//       `
//     });
//     console.log('✅ Contact email sent to admin');
//     console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
//     return { success: true, messageId: info.messageId };
//   } catch (error: any) {
//     console.error('❌ Error sending contact email:', error.message);
//     return { 
//       success: false, 
//       error: error.message 
//     };
//   }
// };
// // Send response email to client
// export const sendResponseToClient = async (
//   clientEmail: string,
//   clientName: string,
//   adminMessage: string
// ): Promise<{ success: boolean; messageId?: string }> => {
//   try {
//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
//                     color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//           .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
//           .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
//           .message-box { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>👋 Hello ${clientName},</h1>
//             <p>Thank you for contacting us!</p>
//           </div>
//           <div class="content">
//             <p>We have received your message and here is our response:</p>
//             <div class="message-box">
//               ${adminMessage.replace(/\n/g, '<br>')}
//             </div>
//             <p>If you have any further questions, feel free to reply to this email.</p>
//             <p style="margin-top: 30px;">
//               Best regards,<br>
//               <strong>${process.env.JSM_FROM_NAME || 'Website Admin'}</strong><br>
//               <a href="mailto:${process.env.JSM_FROM_EMAIL || 'admin@test.com'}">${process.env.JSM_FROM_EMAIL || 'admin@test.com'}</a><br>
//               <a href="tel:${process.env.ADMIN_PHONE || ''}">${process.env.ADMIN_PHONE || ''}</a>
//             </p>
//           </div>
//           <div class="footer">
//             <p>This is an automated message. Please do not reply directly to this email.</p>
//             <p>© ${new Date().getFullYear()} Your Website. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//     const info = await mailer.sendMail({
//       from: `"${process.env.JSM_FROM_NAME || 'Website'}" <${process.env.JSM_FROM_EMAIL || 'noreply@test.com'}>`,
//       to: clientEmail,
//       subject: `Re: Your Contact Form Submission`,
//       html: htmlContent,
//       text: `
//         Hello ${clientName},
//         Thank you for contacting us. Here is our response:
//         ${adminMessage}
//         If you have any further questions, please reply to this email.
//         Best regards,
//         ${process.env.JSM_FROM_NAME || 'Website Admin'}
//         ${process.env.JSM_FROM_EMAIL || 'admin@test.com'}
//         ${process.env.ADMIN_PHONE || ''}
//       `
//     });
//     console.log(`✅ Response email sent to ${clientEmail}`);
//     console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
//     return { success: true, messageId: info.messageId };
//   } catch (error: any) {
//     console.error('❌ Error sending response email:', error.message);
//     throw error;
//   }
// };
// export default mailer;
// import nodemailer from 'nodemailer';
// // Configure Nodemailer with Gmail (FREE)
// const mailer = nodemailer.createTransport({
//   host: process.env.JSM_SMTP_HOST!,
//   port: parseInt(process.env.JSM_SMTP_PORT!),
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: process.env.JSM_SMTP_USER!,
//     pass: process.env.JSM_SMTP_PASS!
//   }
// });
// // Test email configuration
// export const testEmailConfig = async (): Promise<boolean> => {
//   try {
//     console.log('📧 Testing email configuration...');
//     console.log(`Host: ${process.env.JSM_SMTP_HOST}`);
//     console.log(`User: ${process.env.JSM_SMTP_USER}`);
//     await mailer.verify();
//     console.log('✅ Email configuration is valid');
//     return true;
//   } catch (error: any) {
//     console.error('❌ Email configuration error:', error.message);
//     console.log('⚠️  Make sure:');
//     console.log('1. You enabled "Less secure apps" in Google Account');
//     console.log('2. Or created an "App Password" for your Gmail account');
//     console.log('3. Email and password are correct');
//     return false;
//   }
// };
// // Send contact email to admin
// export const sendContactEmailToAdmin = async (
//   name: string,
//   email: string,
//   message: string,
//   phone?: string
// ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
//   try {
//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
//           .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
//           .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
//           .info-item { margin: 10px 0; }
//           .label { font-weight: bold; color: #555; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>📬 New Contact Form Submission</h1>
//           </div>
//           <div class="content">
//             <div class="info-item">
//               <span class="label">👤 Name:</span> ${name}
//             </div>
//             <div class="info-item">
//               <span class="label">📧 Email:</span> <a href="mailto:${email}">${email}</a>
//             </div>
//             ${phone ? `<div class="info-item"><span class="label">📞 Phone:</span> <a href="tel:${phone}">${phone}</a></div>` : ''}
//             <div class="info-item">
//               <span class="label">📅 Date:</span> ${new Date().toLocaleString()}
//             </div>
//             <hr style="margin: 20px 0;">
//             <div class="info-item">
//               <span class="label">💬 Message:</span>
//               <div style="margin-top: 10px; padding: 15px; background: white; border-left: 4px solid #4CAF50;">
//                 ${message.replace(/\n/g, '<br>')}
//               </div>
//             </div>
//           </div>
//           <div class="footer">
//             <p>This message was sent from your website contact form.</p>
//             <p>To reply, click "Reply" in your email client.</p>
//             <p>© ${new Date().getFullYear()} Your Website. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//     const info = await mailer.sendMail({
//       from: `"${process.env.JSM_FROM_NAME}" <${process.env.JSM_FROM_EMAIL}>`,
//       to: process.env.ADMIN_EMAIL!,
//       subject: `📬 New Contact: ${name}`,
//       html: htmlContent,
//       text: `
//         New Contact Form Submission
//         ============================
//         Name: ${name}
//         Email: ${email}
//         Phone: ${phone || 'Not provided'}
//         Date: ${new Date().toLocaleString()}
//         Message:
//         ${message}
//         ---
//         This message was sent from your website contact form.
//       `
//     });
//     console.log('✅ Contact email sent to admin');
//     return { success: true, messageId: info.messageId };
//   } catch (error: any) {
//     console.error('❌ Error sending contact email:', error.message);
//     return { 
//       success: false, 
//       error: error.message 
//     };
//   }
// };
// // Send response email to client
// export const sendResponseToClient = async (
//   clientEmail: string,
//   clientName: string,
//   adminMessage: string
// ): Promise<{ success: boolean; messageId?: string }> => {
//   try {
//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
//                     color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//           .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
//           .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
//           .message-box { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>👋 Hello ${clientName},</h1>
//             <p>Thank you for contacting us!</p>
//           </div>
//           <div class="content">
//             <p>We have received your message and here is our response:</p>
//             <div class="message-box">
//               ${adminMessage.replace(/\n/g, '<br>')}
//             </div>
//             <p>If you have any further questions, feel free to reply to this email.</p>
//             <p style="margin-top: 30px;">
//               Best regards,<br>
//               <strong>${process.env.JSM_FROM_NAME}</strong><br>
//               <a href="mailto:${process.env.JSM_FROM_EMAIL}">${process.env.JSM_FROM_EMAIL}</a><br>
//               <a href="tel:${process.env.ADMIN_PHONE}">${process.env.ADMIN_PHONE}</a>
//             </p>
//           </div>
//           <div class="footer">
//             <p>This is an automated message. Please do not reply directly to this email.</p>
//             <p>© ${new Date().getFullYear()} Your Website. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//     const info = await mailer.sendMail({
//       from: `"${process.env.JSM_FROM_NAME}" <${process.env.JSM_FROM_EMAIL}>`,
//       to: clientEmail,
//       subject: `Re: Your Contact Form Submission`,
//       html: htmlContent,
//       text: `
//         Hello ${clientName},
//         Thank you for contacting us. Here is our response:
//         ${adminMessage}
//         If you have any further questions, please reply to this email.
//         Best regards,
//         ${process.env.JSM_FROM_NAME}
//         ${process.env.JSM_FROM_EMAIL}
//         ${process.env.ADMIN_PHONE}
//       `
//     });
//     console.log(`✅ Response email sent to ${clientEmail}`);
//     return { success: true, messageId: info.messageId };
//   } catch (error: any) {
//     console.error('❌ Error sending response email:', error.message);
//     throw error;
//   }
// };
// export default mailer;
