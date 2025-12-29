const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, message, attachments }) => {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.log('⚠️ Email not configured');
    return;
  }

  if (!to) {
    throw new Error('Recipient email required');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `Propel <${process.env.SMTP_EMAIL}>`,
    to: to,
    subject: subject,
    text: message,
    attachments: attachments
  });

  console.log('✅ Email sent to:', to);
};

module.exports = sendEmail;
