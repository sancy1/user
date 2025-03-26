
// emailServices.js
const { sendVerificationEmail } = require("./verificationEmailService");
const { sendPasswordResetEmail } = require("./passwordResetEmailService");

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};