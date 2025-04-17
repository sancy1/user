


// require("dotenv").config();
// require("express-async-errors");
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");
// const passport = require("./config/passport");
// const connectDB = require("./config/db/connect");
// const routes = require("./routes");
// const swaggerSetup = require("./swagger/swagger");
// const errorHandler = require("./middlewares/errorHandler");

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 3000;

// const API_BASE_URL = process.env.API_BASE_URL || 
//   (process.env.NODE_ENV === 'production' ? 'https://ellux.onrender.com' : `http://localhost:${PORT}`);

// // ======================
// // Security Middleware
// // ======================

// // Force HTTPS in production (Render handles this, but extra protection)
// if (process.env.NODE_ENV === 'production') {
//   app.use((req, res, next) => {
//     if (req.headers['x-forwarded-proto'] !== 'https') {
//       return res.redirect(301, `https://${req.headers.host}${req.url}`);
//     }
//     next();
//   });
// }

// // Security headers
// app.use(helmet());

// // Rate limiting for API routes
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per window
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use("/api/", apiLimiter);

// // ======================
// // Basic Middleware
// // ======================
// app.use(cookieParser());
// app.use(express.json());

// // HTTP request logging
// app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));




// // ======================
// // CORS Configuration
// // ======================

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps, server-to-server, or curl requests)
//     if (!origin) {
//       return callback(null, true);
//     }

//     // List of allowed origins
//     const allowedOrigins = [
//       process.env.FRONTEND_URL, // Ensure this environment variable is correctly set
//       'https://coruscating-snickerdoodle-49faf5.netlify.app',
//       'http://localhost:5173',   // Vite default dev server port
//       'http://localhost:3000',   // Common React dev server port
//       'https://ellux.onrender.com', // Your backend URL (might not need to allow itself)
//       // 'https://*.netlify.app', // This wildcard won't work directly. See explanation below.
//     ].filter(Boolean); // Remove any undefined or empty string values

//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error(`Origin "${origin}" not allowed by CORS`));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// const corsMiddleware = cors(corsOptions);

// app.use(corsMiddleware);
// app.options("*", corsMiddleware); // Handle preflight requests for all routes



// // ======================
// // Authentication
// // ======================
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
//     environment: process.env.NODE_ENV || "development",
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
//         Server successfully initialized
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

const app = express();
const PORT = process.env.PORT || 3000;

const API_BASE_URL = process.env.API_BASE_URL || 
  (process.env.NODE_ENV === 'production' ? 'https://ellux.onrender.com' : `http://localhost:${PORT}`);

// ===================
// CORS CONFIGURATION
// ===================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://coruscating-snickerdoodle-49faf5.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://ellux.onrender.com'
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow non-browser requests (like curl, Postman)
    
    const isAllowed = allowedOrigins.includes(origin);

    // Allow subdomains of netlify.app explicitly
    const isNetlifySubdomain = /^https:\/\/.*\.netlify\.app$/.test(origin);

    if (isAllowed || isNetlifySubdomain) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight support

// ==================
// SECURITY MIDDLEWARE
// ==================
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================
// RATE LIMITING
// ================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
app.use("/api", apiLimiter);

// ==================
// ROUTES & PASSPORT
// ==================
app.use(passport.initialize());
app.use("/api", routes);

// Swagger docs setup
swaggerSetup(app);

// Global error handler
app.use(errorHandler);

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${API_BASE_URL}`);
  });
}).catch((err) => {
  console.error("Database connection failed", err);
});
