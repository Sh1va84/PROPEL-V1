const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Check if SMTP credentials exist
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.log('\n========================================');
    console.log('📧 EMAIL SERVICE - MOCK MODE');
    console.log('========================================');
    console.log('To:', options.email);
    console.log('Subject:', options.subject);
    console.log('Message:', options.message);
    console.log('Attachments:', options.attachments ? options.attachments.length + ' file(s)' : 'None');
    
    if (options.attachments && options.attachments.length > 0) {
      options.attachments.forEach((att, index) => {
        console.log(`  Attachment ${index + 1}:`, att.filename);
        console.log(`  Size:`, att.content ? (att.content.length / 1024).toFixed(2) + ' KB' : 'Unknown');
      });
    }
    
    console.log('========================================');
    console.log('✅ INVOICE SENT (Mock - SMTP not configured)');
    console.log('💡 To enable real emails, add SMTP credentials to .env');
    console.log('========================================\n');
    return; // Exit early - no real email sent
  }

  // Real email sending (if SMTP configured)
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const message = {
      from: `${process.env.FROM_NAME || 'PROPEL'} <${process.env.SMTP_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      attachments: options.attachments
    };

    const info = await transporter.sendMail(message);
    
    console.log('\n========================================');
    console.log('✅ EMAIL SENT SUCCESSFULLY');
    console.log('========================================');
    console.log('To:', options.email);
    console.log('Subject:', options.subject);
    console.log('Message ID:', info.messageId);
    console.log('========================================\n');
    
  } catch (error) {
    console.error('\n========================================');
    console.error('❌ EMAIL SENDING FAILED');
    console.error('========================================');
    console.error('Error:', error.message);
    console.error('To:', options.email);
    console.error('========================================\n');
    throw error; // Re-throw so calling function knows email failed
  }
};

module.exports = sendEmail;
