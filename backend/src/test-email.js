require('dotenv').config();
const sendEmail = require('./utils/emailService');

(async () => {
  try {
    console.log('Testing email...');
    console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
    
    await sendEmail({
      to: 'shiva91official@gmail.com',
      subject: 'Test from Propel',
      message: 'Email is working! 🎉'
    });
    
    console.log('✅ SUCCESS! Check your inbox!');
  } catch (error) {
    console.error('❌ FAILED:', error.message);
  }
})();
