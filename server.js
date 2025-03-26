
const express = require("express");
const passport = require('./config/passport');
require("express-async-errors");
const cors = require("cors");
const connectDB = require("./config/db/connect");
const routes = require("./routes");
const swaggerSetup = require("./swagger/swagger");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require('cookie-parser');
require("dotenv").config();


const app = express(); 
const PORT = process.env.PORT || 3000;

// Use cookie-parser middleware
app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Handle preflight requests for all routes
app.options("*", cors());

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/api", routes);

// Swagger Documentation
swaggerSetup(app);

// Route for the root URL
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Users API!',
    endpoints: {
      // Section spacer
      " ": "─────────────────────────────────────────",
      "Google OAuth2 Authentication": " ",
      " ": "─────────────────────────────────────────",
      
      'GET /api/users/auth/google': 'Initiate Google OAuth authentication',
      'GET /api/users/auth/google/callback': 'Google OAuth callback',
      'POST /api/users/auth/logout': 'Logout user',
      'GET /api/users/auth/switch-account': 'Switch user account',
      'POST /api/users/auth/refresh-token': 'Refresh authentication token',
      
      // Section spacer
      "  ": " ",
      "  ": "─────────────────────────────────────────",
      "  ": "Custom User",
      "  ": "─────────────────────────────────────────",
      
      'POST /api/users/register': 'Register a new user',
      'GET /api/users/admin/unverified': 'Get all unverified users (Admin Only)',
      'GET /api/users/verify-email': 'Verify user email',
      'POST /api/users/login': 'Login user',
      'DELETE /api/users/admin/delete-unverified': 'Delete all unverified users (Admin Only)',
      'PUT /api/users/change-password': 'Change user password',
      'DELETE /api/users/delete': 'Delete user account',
      'GET /api/users/account': 'Get account info',
      'DELETE /api/users/admin/delete-all': 'Delete all users (Admin Only)',
      'DELETE /api/users/admin/delete/{userId}': 'Delete a single user (Admin Only)',
      'GET /api/users/admin/all': 'Get all users (Admin Only)',
      'GET /api/users/admin/{userId}': 'Get a single user (Admin Only)',
      'PUT /api/users/admin/update-role/{userId}': 'Update user role (Admin Only)',
      'POST /api/users/refresh-token': 'Refresh access token',
      'POST /api/users/logout': 'Logout user',
      'POST /api/users/resend-verification-email': 'Resend verification email',
      'DELETE /api/users/admin/delete-all-except-admin': 'Delete all users except admin (Admin Only)',
      'POST /api/users/forgot-password': 'Request a password reset',
      'GET /api/users/reset-password': 'Validate reset password token',
      'POST /api/users/reset-password': 'Reset user password',
      
      // Section spacer
      "   ": " ",
      "   ": "─────────────────────────────────────────",
      "   ": "Profile",
      "   ": "─────────────────────────────────────────",
      
      'GET /api/users/profile': 'Get user profile',
      'PUT /api/users/profile': 'Update user profile (full update)',
      'PATCH /api/users/profile': 'Update user profile (partial update)',
      'DELETE /api/users/profile': 'Delete user profile'
    },
    documentation: 'For detailed documentation, visit /api-docs',
  });
});


// Centralized error handling middleware (must be after all routes)
app.use(errorHandler);

// Connect to MongoDB and Start the Server
const startServer = async () => {
  try {
    await connectDB(); // Wait for MongoDB connection

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

// Start only after DB connection
startServer();