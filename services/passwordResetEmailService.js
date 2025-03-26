// passwordResetEmailService.js
const { apiInstance, createBaseEmail, createEmailTemplate } = require("./emailServices");

const sendPasswordResetEmail = async (email, token, username) => {
  try {
    const resetUrl = `${process.env.API_BASE_URL}/api/users/reset-password?token=${token}`;
    const expirationDate = new Date(Date.now() + 86400000) // 24 hours in milliseconds
    
    const emailContent = createEmailTemplate({
      title: "Password Reset",
      subtitle: "Secure your account",
      username,
      mainContent: `
        <p>We received a request to reset the password for your Ellux account. 
        To proceed with resetting your password, please click the button below:</p>
      `,
      buttonText: "Reset Password",
      actionUrl: resetUrl,
      expirationDate,
      securityNotice: "If you didn't request this password reset, please ignore this email or contact support immediately. Your account security is important to us."
    });

    const sendSmtpEmail = createBaseEmail(email, "Reset Your Ellux Password");
    sendSmtpEmail.htmlContent = emailContent;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

module.exports = { sendPasswordResetEmail };