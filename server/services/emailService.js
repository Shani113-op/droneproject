const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials not configured. Skipping email send.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use host/port for generic SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
  return true;
};

module.exports = {
  sendEmail
};
