const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.log('----------------------------------------------------');
    console.log('⚠️  NO EMAIL SERVER CONFIGURED. MOCK EMAIL SENT:');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    if(options.attachments) console.log(`[Attachment: ${options.attachments[0].filename}]`);
    console.log('----------------------------------------------------');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', 
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
    attachments: options.attachments
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
