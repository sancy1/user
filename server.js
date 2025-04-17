
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

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

// ======================
// Basic Middleware
// ======================
app.use(cookieParser());
app.use(express.json());

// HTTP request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ======================
// CORS Configuration
// ======================
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);

//     const allowedOrigins = [
//       process.env.FRONTEND_URL,
//       'https://coruscating-snickerdoodle-49faf5.netlify.app',
//       'http://localhost:5173',
//       'http://localhost:3000',
//       'https://ellux.onrender.com',
//       'https://*.netlify.app',
      
//       'http://localhost:3000/api-docs', 
//       'http://localhost:3000/api-docs/'
//     ].filter(Boolean);

//     if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };

// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));




const allowedOrigins = [
  // Primary production frontend
  'https://coruscating-snickerdoodle-49faf5.netlify.app',
  
  // Render backend (for API-to-API calls)
  'https://ellux.onrender.com',
  
  // Development environments
  ...(process.env.NODE_ENV === 'development' ? [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Local API server
    'http://localhost:3000/api-docs', // Local Swagger
  ] : []),
  
  // Netlify preview deployments
  'https://*.netlify.app',
  
  // Fallback to env variable
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin matches exactly or matches a wildcard pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        // Convert wildcard pattern to regex (e.g., 'https://*.netlify.app' -> /^https:\/\/.*\.netlify\.app$/)
        const regexPattern = allowed.replace(/\./g, '\\.').replace(/\*/g, '.*');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(origin);
      }
      return origin === allowed;
    });

    isAllowed 
      ? callback(null, true)
      : callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));



// ======================
// Authentication
// ======================
app.use(passport.initialize());

// ======================
// API Routes
// ======================
app.use("/api", routes);

// ======================
// Documentation
// ======================
swaggerSetup(app);

// ======================
// Root Endpoint
// ======================
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Users API!",
    apiBaseUrl: API_BASE_URL,
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      authentication: {
        google: {
          initiate: "GET /api/users/auth/google",
          callback: "GET /api/users/auth/google/callback",
          logout: "POST /api/users/auth/logout",
          switchAccount: "GET /api/users/auth/switch-account",
          refreshToken: "POST /api/users/auth/refresh-token",
        },
      },
      users: {
        register: "POST /api/users/register",
        verifyEmail: "GET /api/users/verify-email",
        login: "POST /api/users/login",
        account: "GET /api/users/account",
        adminOperations: {
          unverifiedUsers: "GET /api/users/admin/unverified",
          deleteUnverified: "DELETE /api/users/admin/delete-unverified",
          allUsers: "GET /api/users/admin/all",
          userById: "GET /api/users/admin/{userId}",
          updateRole: "PUT /api/users/admin/update-role/{userId}",
          deleteAll: "DELETE /api/users/admin/delete-all",
          deleteAllExceptAdmin: "DELETE /api/users/admin/delete-all-except-admin",
        },
      },
      profile: {
        get: "GET /api/users/profile",
        update: {
          full: "PUT /api/users/profile",
          partial: "PATCH /api/users/profile",
        },
        delete: "DELETE /api/users/profile",
      },
    },
    documentation: `${API_BASE_URL}/api-docs`,
  });
});

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

