

require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const passport = require("./config/passport");
const connectDB = require("./config/db/connect");
const routes = require("./routes");
const swaggerSetup = require("./swagger/swagger");
const errorHandler = require("./middlewares/errorHandler");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

const API_BASE_URL = process.env.API_BASE_URL || 
  (process.env.NODE_ENV === 'production' ? 'https://ellux.onrender.com' : `http://localhost:${PORT}`);

// ======================
// Security Middleware
// ======================

// Force HTTPS in production (Render handles this, but extra protection)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Security headers
app.use(helmet());

// CORS configuration - FIXED VERSION
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://coruscating-snickerdoodle-49faf5.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://ellux.onrender.com'
].filter(Boolean); // Remove any undefined values

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Rest of your middleware and routes setup...

// ======================
// Error Handling
// ======================
app.use(errorHandler);

// ======================
// Server Initialization
// ======================
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`
      ==================================
        Server successfully initialized
      ==================================
      API Base URL: ${API_BASE_URL}
      Port: ${PORT}
      Environment: ${process.env.NODE_ENV || "development"}
      Allowed Origins: ${corsOptions.origin.toString()}
      MongoDB: Connected
      ==================================
      `);
    });
  } catch (error) {
    console.error("Server initialization failed:", error.message);
    process.exit(1);
  }
};

startServer();

