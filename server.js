


// require("dotenv").config();
// require("express-async-errors");
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const path = require("path");
// const passport = require("./config/passport");
// const connectDB = require("./config/db/connect");
// const routes = require("./routes");
// const swaggerSetup = require("./swagger/swagger");
// const errorHandler = require("./middlewares/errorHandler");

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 3000;
// const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;

// // ======================
// // Middleware Setup
// // ======================
// app.use(cookieParser());
// app.use(express.json());

// // Enhanced CORS Configuration
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     // List of allowed origins
//     const allowedOrigins = [
//       process.env.FRONTEND_URL,
//       'http://localhost:5173', // Default Vite server
//       'https://ellux.onrender.com' // Your Render URL
//     ].filter(Boolean); // Remove any undefined values

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

// // Passport Initialization
// app.use(passport.initialize());

// // ======================
// // API Routes
// // ======================
// app.use("/api", routes);

// // ======================
// // Documentation
// // ======================
// swaggerSetup(app);

// // ======================
// // Root Endpoint
// // ======================
// app.get("/", (req, res) => {
//   res.json({
//     message: "Welcome to the Users API!",
//     apiBaseUrl: API_BASE_URL,
//     allowedOrigins: corsOptions.origin.toString(),
//     endpoints: {
//       authentication: {
//         google: {
//           initiate: "GET /api/users/auth/google",
//           callback: "GET /api/users/auth/google/callback",
//           logout: "POST /api/users/auth/logout",
//           switchAccount: "GET /api/users/auth/switch-account",
//           refreshToken: "POST /api/users/auth/refresh-token",
//         },
//       },
//       users: {
//         register: "POST /api/users/register",
//         verifyEmail: "GET /api/users/verify-email",
//         login: "POST /api/users/login",
//         account: "GET /api/users/account",
//         adminOperations: {
//           unverifiedUsers: "GET /api/users/admin/unverified",
//           deleteUnverified: "DELETE /api/users/admin/delete-unverified",
//           allUsers: "GET /api/users/admin/all",
//           userById: "GET /api/users/admin/{userId}",
//           updateRole: "PUT /api/users/admin/update-role/{userId}",
//           deleteAll: "DELETE /api/users/admin/delete-all",
//           deleteAllExceptAdmin: "DELETE /api/users/admin/delete-all-except-admin",
//         },
//       },
//       profile: {
//         get: "GET /api/users/profile",
//         update: {
//           full: "PUT /api/users/profile",
//           partial: "PATCH /api/users/profile",
//         },
//         delete: "DELETE /api/users/profile",
//       },
//     },
//     documentation: `${API_BASE_URL}/api-docs`,
//   });
// });

// // ======================
// // Production Configuration
// // ======================
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
//   });
// }

// // ======================
// // Error Handling
// // ======================
// app.use(errorHandler);

// // ======================
// // Server Initialization
// // ======================
// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`
//       ==================================
//        Server successfully initialized
//       ==================================
//       API Base URL: ${API_BASE_URL}
//       Port: ${PORT}
//       Environment: ${process.env.NODE_ENV || "development"}
//       Allowed Origins: ${corsOptions.origin.toString()}
//       MongoDB: Connected
//       ==================================
//       `);
//     });
//   } catch (error) {
//     console.error("Server initialization failed:", error.message);
//     process.exit(1);
//   }
// };

// startServer();

















// require("dotenv").config();
// require("express-async-errors");
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const path = require("path");
// const passport = require("./config/passport");
// const connectDB = require("./config/db/connect");
// const routes = require("./routes");
// const swaggerSetup = require("./swagger/swagger");
// const errorHandler = require("./middlewares/errorHandler");

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 3000;
// const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;

// // ======================
// // Enhanced CORS Configuration
// // ======================
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     // List of allowed origins
//     const allowedOrigins = [
//       process.env.FRONTEND_URL,
//       'http://localhost:5173',
//       'http://localhost:3000',
//       'https://ellux.onrender.com'
//     ].filter(Boolean);

//     // Check if origin matches any allowed origin or subdomains
//     if (allowedOrigins.some(allowed => 
//       origin === allowed || 
//       origin.startsWith(allowed.replace(/\/$/, ''))
//     )) {
//       callback(null, true);
//     } else {
//       console.warn('CORS blocked for origin:', origin);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   exposedHeaders: ['set-cookie']
//   // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   // exposedHeaders: ['Content-Length', 'X-Powered-By']
// };

// // ======================
// // Middleware Setup
// // ======================
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
// app.use(cookieParser());
// app.use(express.json());

// // Special OPTIONS handler for preflight requests
// app.use((req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     return res.status(200).json({});
//   }
//   next();
// });

// // Passport Initialization
// app.use(passport.initialize());

// // ======================
// // API Routes
// // ======================
// app.use("/api", routes);

// // ======================
// // Documentation
// // ======================
// swaggerSetup(app);

// // ======================
// // Root Endpoint
// // ======================
// app.get("/", (req, res) => {
//   res.json({
//     message: "Welcome to the Users API!",
//     apiBaseUrl: API_BASE_URL,
//     allowedOrigins: corsOptions.origin.toString(),
//     endpoints: {
//       authentication: {
//         google: {
//           initiate: "GET /api/users/auth/google",
//           callback: "GET /api/users/auth/google/callback",
//           logout: "POST /api/users/auth/logout",
//           switchAccount: "GET /api/users/auth/switch-account",
//           refreshToken: "POST /api/users/auth/refresh-token",
//         },
//       },
//       users: {
//         register: "POST /api/users/register",
//         verifyEmail: "GET /api/users/verify-email",
//         login: "POST /api/users/login",
//         account: "GET /api/users/account",
//         adminOperations: {
//           unverifiedUsers: "GET /api/users/admin/unverified",
//           deleteUnverified: "DELETE /api/users/admin/delete-unverified",
//           allUsers: "GET /api/users/admin/all",
//           userById: "GET /api/users/admin/{userId}",
//           updateRole: "PUT /api/users/admin/update-role/{userId}",
//           deleteAll: "DELETE /api/users/admin/delete-all",
//           deleteAllExceptAdmin: "DELETE /api/users/admin/delete-all-except-admin",
//         },
//       },
//       profile: {
//         get: "GET /api/users/profile",
//         update: {
//           full: "PUT /api/users/profile",
//           partial: "PATCH /api/users/profile",
//         },
//         delete: "DELETE /api/users/profile",
//       },
//     },
//     documentation: `${API_BASE_URL}/api-docs`,
//   });
// });

// // ======================
// // Production Configuration
// // ======================
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
//   });
// }

// // ======================
// // Error Handling
// // ======================
// app.use(errorHandler);

// // ======================
// // Server Initialization
// // ======================
// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`
//       ==================================
//        Server successfully initialized
//       ==================================
//       API Base URL: ${API_BASE_URL}
//       Port: ${PORT}
//       Environment: ${process.env.NODE_ENV || "development"}
//       Allowed Origins: ${corsOptions.origin.toString()}
//       MongoDB: Connected
//       ==================================
//       `);
//     });
//   } catch (error) {
//     console.error("Server initialization failed:", error.message);
//     process.exit(1);
//   }
// };

// startServer();
























// require("dotenv").config();
// require("express-async-errors");
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const path = require("path");
// const passport = require("./config/passport");
// const connectDB = require("./config/db/connect");
// const routes = require("./routes");
// const swaggerSetup = require("./swagger/swagger");
// const errorHandler = require("./middlewares/errorHandler");

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 3000;
// const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;

// // ======================
// // Enhanced CORS Configuration
// // ======================
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     // List of allowed origins
//     const allowedOrigins = [
//       process.env.FRONTEND_URL,
//       'http://localhost:5173',
//       'http://localhost:3000',
//       'https://ellux.onrender.com'
//     ].filter(Boolean);

//     // Check if origin matches any allowed origin or subdomains
//     if (allowedOrigins.some(allowed => 
//       origin === allowed || 
//       origin.startsWith(allowed.replace(/\/$/, ''))
//     )) {
//       callback(null, true);
//     } else {
//       console.warn('CORS blocked for origin:', origin);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//   exposedHeaders: ['set-cookie']
// };

// // ======================
// // Middleware Setup
// // ======================
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
// app.use(cookieParser());
// app.use(express.json());

// // Ensure all responses are JSON
// app.use((req, res, next) => {
//   // Set default Content-Type for all responses
//   res.setHeader('Content-Type', 'application/json');
  
//   // Special handling for OPTIONS preflight
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
//     return res.status(200).json({});
//   }
//   next();
// });

// // Passport Initialization
// app.use(passport.initialize());

// // ======================
// // API Routes
// // ======================
// app.use("/api", routes);

// // ======================
// // Documentation
// // ======================
// swaggerSetup(app);

// // ======================
// // Root Endpoint
// // ======================
// app.get("/", (req, res) => {
//   res.json({
//     message: "Welcome to the Users API!",
//     apiBaseUrl: API_BASE_URL,
//     allowedOrigins: corsOptions.origin.toString(),
//     documentation: `${API_BASE_URL}/api-docs`,
//     status: "operational"
//   });
// });

// // ======================
// // Production Configuration
// // ======================
// // if (process.env.NODE_ENV === "production") {
// //   app.use(express.static(path.join(__dirname, "../client/dist")));
  
// //   // Handle SPA fallback
// //   app.get("*", (req, res) => {
// //     res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// //   });
// // }

// // if (process.env.NODE_ENV === "production") {
// //   app.use(express.static(path.join(__dirname, "../client/dist")));
  
// //   app.get("*", (req, res) => {
// //     res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// //   });
// // } else {
// //   // Development-specific configuration
// //   app.get('/reset-password-verification.html', (req, res) => {
// //     res.redirect('http://localhost:5173/reset-password-verification.html');
// //   });
// // }


// // ======================
// // Static Files & SPA Handling
// // ======================
// // if (process.env.NODE_ENV === "production") {
// //   app.use(express.static(path.join(__dirname, "../client/dist")));
  
// //   app.get("*", (req, res) => {
// //     res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// //   });
// // } else {
// //   // Development-specific: Proxy frontend requests to Vite server
// //   app.use((req, res, next) => {
// //     // Only handle HTML requests in development
// //     if (req.accepts('html') && !req.path.startsWith('/api')) {
// //       return res.redirect(`http://localhost:5173${req.originalUrl}`);
// //     }
// //     next();
// //   });
// // }





// // ======================
// // Enhanced Error Handling Middleware
// // ======================
// app.use((err, req, res, next) => {
//   if (res.headersSent) {
//     return next(err);
//   }
  
//   // Ensure error response is JSON
//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message,
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// });

// // Register the errorHandler middleware
// app.use(errorHandler);

// // ======================
// // 404 Handler
// // ======================
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Endpoint not found",
//     requestedUrl: req.originalUrl
//   });
// });

// // ======================
// // Server Initialization
// // ======================
// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`
//       ==================================
//        Server successfully initialized
//       ==================================
//       API Base URL: ${API_BASE_URL}
//       Port: ${PORT}
//       Environment: ${process.env.NODE_ENV || "development"}
//       Allowed Origins: ${corsOptions.origin.toString()}
//       MongoDB: Connected
//       ==================================
//       `);
//     });
//   } catch (error) {
//     console.error("Server initialization failed:", error.message);
//     process.exit(1);
//   }
// };

// startServer();




















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
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://coruscating-snickerdoodle-49faf5.netlify.app',
      'http://localhost:5173', // Your Vite frontend
      'http://localhost:3000', // The API server itself
      'https://ellux.onrender.com',
      'https://*.netlify.app',
      // Add these for Swagger UI:
      'http://localhost:3000/api-docs', 
      'http://localhost:3000/api-docs/'
    ].filter(Boolean);

    if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


// const allowedOrigins = [
//   // Primary production frontend
//   'https://coruscating-snickerdoodle-49faf5.netlify.app',
  
//   // Render backend (for API-to-API calls)
//   'https://ellux.onrender.com',
  
//   // Development environments
//   ...(process.env.NODE_ENV === 'development' ? [
//     'http://localhost:5173', // Vite dev server
//     'http://localhost:3000', // Local API server
//     'http://localhost:3000/api-docs', // Local Swagger
//   ] : []),
  
//   // Netlify preview deployments
//   'https://*.netlify.app',
  
//   // Fallback to env variable
//   process.env.FRONTEND_URL
// ].filter(Boolean);

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);

//     // Check if the origin matches exactly or matches a wildcard pattern
//     const isAllowed = allowedOrigins.some(allowed => {
//       if (allowed.includes('*')) {
//         // Convert wildcard pattern to regex (e.g., 'https://*.netlify.app' -> /^https:\/\/.*\.netlify\.app$/)
//         const regexPattern = allowed.replace(/\./g, '\\.').replace(/\*/g, '.*');
//         const regex = new RegExp(`^${regexPattern}$`);
//         return regex.test(origin);
//       }
//       return origin === allowed;
//     });

//     isAllowed 
//       ? callback(null, true)
//       : callback(new Error(`Origin ${origin} not allowed by CORS`));
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };

// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

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















// const express = require("express");
// const passport = require('./config/passport');
// require("express-async-errors");
// const cors = require("cors");
// const connectDB = require("./config/db/connect");
// const routes = require("./routes");
// const swaggerSetup = require("./swagger/swagger");
// const errorHandler = require("./middlewares/errorHandler");
// const cookieParser = require('cookie-parser');
// require("dotenv").config();


// const app = express(); 
// const PORT = process.env.PORT || 3000;

// // Use cookie-parser middleware
// app.use(cookieParser());

// // Middleware to parse JSON
// app.use(express.json());

// // Enable CORS for all routes
// app.use(cors());

// // Handle preflight requests for all routes
// app.options("*", cors());

// // Initialize Passport
// app.use(passport.initialize());

// // Routes
// app.use("/api", routes);

// // Swagger Documentation
// swaggerSetup(app);

// // Route for the root URL
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Welcome to the Users API!',
//     endpoints: {
//       // Section spacer
//       " ": "─────────────────────────────────────────",
//       "Google OAuth2 Authentication": " ",
//       " ": "─────────────────────────────────────────",
      
//       'GET /api/users/auth/google': 'Initiate Google OAuth authentication',
//       'GET /api/users/auth/google/callback': 'Google OAuth callback',
//       'POST /api/users/auth/logout': 'Logout user',
//       'GET /api/users/auth/switch-account': 'Switch user account',
//       'POST /api/users/auth/refresh-token': 'Refresh authentication token',
      
//       // Section spacer
//       "  ": " ",
//       "  ": "─────────────────────────────────────────",
//       "  ": "Custom User",
//       "  ": "─────────────────────────────────────────",
      
//       'POST /api/users/register': 'Register a new user',
//       'GET /api/users/admin/unverified': 'Get all unverified users (Admin Only)',
//       'GET /api/users/verify-email': 'Verify user email',
//       'POST /api/users/login': 'Login user',
//       'DELETE /api/users/admin/delete-unverified': 'Delete all unverified users (Admin Only)',
//       'PUT /api/users/change-password': 'Change user password',
//       'DELETE /api/users/delete': 'Delete user account',
//       'GET /api/users/account': 'Get account info',
//       'DELETE /api/users/admin/delete-all': 'Delete all users (Admin Only)',
//       'DELETE /api/users/admin/delete/{userId}': 'Delete a single user (Admin Only)',
//       'GET /api/users/admin/all': 'Get all users (Admin Only)',
//       'GET /api/users/admin/{userId}': 'Get a single user (Admin Only)',
//       'PUT /api/users/admin/update-role/{userId}': 'Update user role (Admin Only)',
//       'POST /api/users/refresh-token': 'Refresh access token',
//       'POST /api/users/logout': 'Logout user',
//       'POST /api/users/resend-verification-email': 'Resend verification email',
//       'DELETE /api/users/admin/delete-all-except-admin': 'Delete all users except admin (Admin Only)',
//       'POST /api/users/forgot-password': 'Request a password reset',
//       'GET /api/users/reset-password': 'Validate reset password token',
//       'POST /api/users/reset-password': 'Reset user password',
      
//       // Section spacer
//       "   ": " ",
//       "   ": "─────────────────────────────────────────",
//       "   ": "Profile",
//       "   ": "─────────────────────────────────────────",
      
//       'GET /api/users/profile': 'Get user profile',
//       'PUT /api/users/profile': 'Update user profile (full update)',
//       'PATCH /api/users/profile': 'Update user profile (partial update)',
//       'DELETE /api/users/profile': 'Delete user profile'
//     },
//     documentation: 'For detailed documentation, visit /api-docs',
//   });
// });


// // Centralized error handling middleware (must be after all routes)
// app.use(errorHandler);

// // Connect to MongoDB and Start the Server
// const startServer = async () => {
//   try {
//     await connectDB(); // Wait for MongoDB connection

//     // Start the server
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error.message);
//   }
// };

// // Start only after DB connection
// startServer();