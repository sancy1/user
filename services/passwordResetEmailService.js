// passwordResetEmailService.js
const { apiInstance, createBaseEmail, createEmailTemplate } = require("./emailServices");

const sendPasswordResetEmail = async (email, token, username) => {
  try {
    const response = await fetch(`${AuthService.apiBaseUrl}/api/users/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.userId,
        token: this.token,
        newPassword: qs('#newPassword').value,
        confirmNewPassword: qs('#confirmNewPassword').value
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Password reset failed');
    }

    // Redirect on success
    window.location.href = '/signin.html?reset=success';
    
  } catch (error) {
    ErrorService.displayFormError('form-error', error.message);
  } finally {
    const submitButton = qs('#reset-password-form .btn');
    if (submitButton) {
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
    }
  }
}

module.exports = { sendPasswordResetEmail };



















// const { apiInstance, createBaseEmail, createEmailTemplate } = require("./emailServices");

// const sendPasswordResetEmail = async (email, token, username) => {
//   try {
//     // Use FRONTEND_URL instead of API_BASE_URL
//     const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password-verification.html?token=${token}`;

//   // const resetUrl = process.env.NODE_ENV === "production" 
//   // ? `${process.env.FRONTEND_URL}/reset-password-verification.html?token=${token}&userId=${userId}`
//   // : `http://localhost:5173/reset-password-verification.html?token=${token}&userId=${userId}`;

//     const expirationDate = new Date(Date.now() + 86400000); // 24 hours in milliseconds
    
//     const emailContent = createEmailTemplate({
//       title: "Password Reset",
//       subtitle: "Secure your account",
//       username,
//       mainContent: `
//         <p>We received a request to reset the password for your Ellux account. 
//         To proceed with resetting your password, please click the button below:</p>
//       `,
//       buttonText: "Reset Password",
//       actionUrl: resetUrl,
//       expirationDate,
//       securityNotice: "If you didn't request this password reset, please ignore this email or contact support immediately. Your account security is important to us."
//     });

//     const sendSmtpEmail = createBaseEmail(email, "Reset Your Ellux Password");
//     sendSmtpEmail.htmlContent = emailContent;

//     await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log("Password reset email sent");
//   } catch (error) {
//     console.error("Error sending password reset email:", error);
//     throw new Error("Failed to send password reset email");
//   }
// };

// module.exports = { sendPasswordResetEmail };