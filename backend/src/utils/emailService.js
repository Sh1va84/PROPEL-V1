const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Check if email credentials exist in .env
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.log('----------------------------------------------------');
    console.log('⚠️  NO EMAIL SERVER CONFIGURED. MOCK EMAIL SENT:');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    console.log('----------------------------------------------------');
    return;
  }

  // 2. If credentials exist, send real email
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'SendGrid', 'Mailgun'
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;