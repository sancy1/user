// verificationEmailService.js
const { apiInstance, createBaseEmail, createEmailTemplate } = require("./emailServices");

const sendVerificationEmail = async (email, token, username) => {
  try {
    const verificationUrl = `${process.env.API_BASE_URL}/api/users/verify-email?token=${token}`;
    const expirationDate = new Date(Date.now() + 86400000) // 24 hours in milliseconds
    
    const emailContent = createEmailTemplate({
      title: "Verify Your Account",
      subtitle: "One quick step to get started",
      username,
      mainContent: `
        <p>Thank you for signing up for Ellux! To ensure the security of your account, 
        please verify your email address by clicking the button below:</p>
      `,
      buttonText: "Verify Email Address",
      actionUrl: verificationUrl,
      expirationDate,
      securityNotice: "If you didn't create this account, please ignore this email or contact support immediately. Your account security is important to us."
    });

    const sendSmtpEmail = createBaseEmail(email, "Verify Your Ellux Account");
    sendSmtpEmail.htmlContent = emailContent;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Verification email sent");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

module.exports = { sendVerificationEmail };