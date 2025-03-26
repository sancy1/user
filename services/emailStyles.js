// emailStyles.js
module.exports = `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          :root {
            --primary: #6366F1;
            --primary-dark: #4F46E5;
            --secondary: #10B981;
            --dark: #1F2937;
            --light: #F9FAFB;
            --gray: #9CA3AF;
            --danger: #EF4444;
            --warning: #F59E0B;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: var(--dark);
            background-color: #F3F4F6;
            padding: 0;
            margin: 0;
          }
          
          .wrapper {
            background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
            padding: 40px 20px;
          }
          
          .container {
            max-width: 600px;
            background: white;
            margin: 0 auto;
            padding: 0;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
            padding: 30px;
            text-align: center;
            color: white;
          }
          
          .logo-container {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
          }
          
          .avatar {
            width: 70px !important;
            height: 70px !important;
            border-radius: 50% !important;
            object-fit: cover !important;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
            border: 4px solid rgba(255, 255, 255, 0.2) !important;
          }
          
          .title {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.025em;
          }
          
          .subtitle {
            font-size: 16px;
            opacity: 0.9;
            margin-top: 8px;
            color:rgb(227, 227, 227);
          }
          
          .content {
            padding: 40px 30px;
          }
          
          h2 {
            font-size: 22px;
            font-weight: 600;
            color: var(--dark);
            margin-top: 0;
            margin-bottom: 20px;
          }
          
          p {
            font-size: 16px;
            color: #4B5563;
            margin-bottom: 24px;
          }
          
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
            color: white;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.2s ease;
            box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4), 0 2px 4px -1px rgba(99, 102, 241, 0.2);
          }
          
          .button:hover {
            background-color: black;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4), 0 4px 6px -2px rgba(99, 102, 241, 0.2);
          }
          
          .link-fallback {
            margin: 24px 0;
            padding: 16px;
            background-color: #F9FAFB;
            border-radius: 8px;
            word-break: break-all;
            font-size: 14px;
            color: #6B7280;
            border: 1px solid #E5E7EB;
          }
          
          .expiration-notice {
            margin: 30px 0;
            padding: 16px;
            background-color: #FEF3C7;
            border-radius: 8px;
            font-size: 15px;
            color: #92400E;
            display: flex;
            align-items: center;
            border-left: 4px solid #F59E0B;
          }
          
          .expiration-notice svg {
            margin-right: 12px;
            flex-shrink: 0;
          }
          
          .security-info {
            margin: 30px 0;
            padding: 16px;
            background-color: #ECFDF5;
            border-radius: 8px;
            font-size: 15px;
            color: #065F46;
            display: flex;
            align-items: flex-start;
            border-left: 4px solid #10B981;
          }
          
          .security-info svg {
            margin-right: 12px;
            margin-top: 2px;
            flex-shrink: 0;
          }
          
          .divider {
            height: 1px;
            background-color: #E5E7EB;
            margin: 30px 0;
          }
          
          .support-info {
            margin: 30px 0;
            padding: 20px;
            background-color: #F3F4F6;
            border-radius: 8px;
            text-align: center;
          }
          
          .support-info p {
            margin: 0;
          }
          
          .support-info a {
            color: #6366F1;
            text-decoration: none;
            font-weight: 500;
          }
          
          .support-info a:hover {
            text-decoration: underline;
          }
          
          .thankyou {
            margin-top: 30px;
            font-style: normal;
            text-align: center;
          }
          
          .thankyou p {
            margin-bottom: 5px;
          }
          
          .footer {
            background-color: #F9FAFB;
            padding: 24px 30px;
            font-size: 14px;
            color: #6B7280;
            text-align: center;
            border-top: 1px solid #E5E7EB;
          }
          
          .social-links {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
          }
          
          .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #E5E7EB;
            margin: 0 8px;
            color: #4B5563;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          
          .social-link:hover {
            background-color: #6366F1;
            color: white;
            transform: translateY(-2px);
          }
          
          @media (max-width: 600px) {
            .container {
              border-radius: 0;
            }
            .content {
              padding: 30px 20px;
            }
          }
`;