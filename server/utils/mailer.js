const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

function sendOTP(email, otp) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "AniSport - OTP Verification",
    text: `Your OTP code is: ${otp}`,
  });
}

module.exports = sendOTP;
