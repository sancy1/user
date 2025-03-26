// emailService.js
require("dotenv").config();
const SibApiV3Sdk = require("@getbrevo/brevo");
const emailStyles = require("./emailStyles");

const hoursRemaining = 24

// Initialize the API client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

// Generate avatar with custom 'E' and gradient background
const generateEmailAvatar = () => {
  return `https://ui-avatars.com/api/?name=E&background=6366F1&color=fff&size=128&bold=true&fontSize=0.6`;
};

const createBaseEmail = (email, subject) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.sender = {
    name: "Ellux Support",
    email: process.env.EMAIL_SENDER_EMAIL,
  };
  sendSmtpEmail.to = [{ email }];
  return sendSmtpEmail;
};

const createEmailTemplate = (options) => {
  const {
    title,
    subtitle,
    username,
    mainContent,
    buttonText,
    actionUrl,
    expirationDate,
    securityNotice,
    showSupportInfo = true,
  } = options;

  const avatarUrl = generateEmailAvatar();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
      <title>${title}</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="logo-container">
                <img src="${avatarUrl}" alt="Ellux Logo" class="avatar">
              </div>
              <h1 class="title">${title}</h1>
              <p class="subtitle">${subtitle}</p>
            </div>
          
          <div class="content">
            <h2>Hello ${username},</h2>
            ${mainContent}
            
            <div class="button-container">
              <a href="${actionUrl}" class="button">${buttonText}</a>
            </div>
            
            <p>If you're having trouble with the button above, you can copy and paste the URL below into your browser:</p>
            
            <div class="link-fallback">
              ${actionUrl}
            </div>
            
            <div class="expiration-notice">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div>
                  <strong>Important:</strong> This password reset link will expire on 
                  ${expirationDate instanceof Date && !isNaN(expirationDate) ? expirationDate.toLocaleString() : "tomorrow"} 
                  (approximately ${hoursRemaining} ${hoursRemaining === 1 ? "hour" : "hours"} from now)
                </div>
            </div>
            
            ${securityNotice ? `
            <div class="security-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <div>
                <strong>Security Notice:</strong> ${securityNotice}
              </div>
            </div>
            ` : ''}
            
            <div class="divider"></div>
            
            ${showSupportInfo ? `
            <div class="support-info">
              <p>Need help or have questions?</p>
              <p>Contact our support team at <a href="mailto:support@Ellux.com">support@Ellux.com</a></p>
            </div>
            
            <div class="thankyou">
              <p>Thank you for using Ellux,</p>
              <p><strong>The Ellux Team</strong></p>
            </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <div class="social-links">
              <a href="#" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
            <p>&copy; ${new Date().getFullYear()} Ellux. All rights reserved.</p>
            <p>Ellux • Ocean view • Victoria Island</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  apiInstance,
  generateEmailAvatar,
  createBaseEmail,
  createEmailTemplate
};