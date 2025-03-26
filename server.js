
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
      
      'GET /users/auth/google': 'Initiate Google OAuth authentication',
      'GET /users/auth/google/callback': 'Google OAuth callback',
      'POST /users/auth/logout': 'Logout user',
      'GET /users/auth/switch-account': 'Switch user account',
      'POST /users/auth/refresh-token': 'Refresh authentication token',
      
      // Section spacer
      "  ": " ",
      "  ": "─────────────────────────────────────────",
      "  ": "Custom User",
      "  ": "─────────────────────────────────────────",
      
      'POST /users/register': 'Register a new user',
      'GET /users/admin/unverified': 'Get all unverified users (Admin Only)',
      'GET /users/verify-email': 'Verify user email',
      'POST /users/login': 'Login user',
      'DELETE /users/admin/delete-unverified': 'Delete all unverified users (Admin Only)',
      'PUT /users/change-password': 'Change user password',
      'DELETE /users/delete': 'Delete user account',
      'GET /users/account': 'Get account info',
      'DELETE /users/admin/delete-all': 'Delete all users (Admin Only)',
      'DELETE /users/admin/delete/{userId}': 'Delete a single user (Admin Only)',
      'GET /users/admin/all': 'Get all users (Admin Only)',
      'GET /users/admin/{userId}': 'Get a single user (Admin Only)',
      'PUT /users/admin/update-role/{userId}': 'Update user role (Admin Only)',
      'POST /users/refresh-token': 'Refresh access token',
      'POST /users/logout': 'Logout user',
      'POST /users/resend-verification-email': 'Resend verification email',
      'DELETE /users/admin/delete-all-except-admin': 'Delete all users except admin (Admin Only)',
      'POST /users/forgot-password': 'Request a password reset',
      'GET /users/reset-password': 'Validate reset password token',
      'POST /users/reset-password': 'Reset user password',
      
      // Section spacer
      "   ": " ",
      "   ": "─────────────────────────────────────────",
      "   ": "Profile",
      "   ": "─────────────────────────────────────────",
      
      'GET /profile': 'Get user profile',
      'PUT /profile': 'Update user profile (full update)',
      'PATCH /profile': 'Update user profile (partial update)',
      'DELETE /profile': 'Delete user profile'
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