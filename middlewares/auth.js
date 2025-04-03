const jwt = require("jsonwebtoken");


// Generate JWT token --------------------------------------------------------------
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role }, // role included in the token payload
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token expires in 1 hour
  );
};


// Generate Refresh Token --------------------------------------------------------------
const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // Refresh token expires in 7 days
  );
};


// Middleware to protect routes --------------------------------------------------------------
// const protect = (req, res, next) => {
//   let token;

//   // Check if the token is in the headers
//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1]; // Extract the token
//   }

//   if (!token) {
//     const error = new Error("Not authorized, no token");
//     error.statusCode = 401; 
//     throw error; 
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach the decoded data to the request object
//     console.log("Decoded user:", decoded); // Debugging log
//     next();
//   } catch (error) {
//     console.error("Token verification failed:", error); // Loging the error for debugging
//     const err = new Error("Not authorized, token failed");
//     err.statusCode = 401; 
//     throw err; 
//   }
// };


const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      _id: decoded.userId,  // Make sure this matches your JWT payload
      role: decoded.role
    };
    console.log('Decoded user:', req.user); // Debug log
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};


// Middleware to check if user is an admin --------------------------------------------------------------
const isAdmin = (req, res, next) => {
  console.log("User role:", req.user.role); // Debugging log

  if (req.user.role !== "admin") {
    const error = new Error("Not authorized as an admin");
    error.statusCode = 403; 
    throw error; 
  }

  next();
};

module.exports = { generateToken, generateRefreshToken, protect, isAdmin };

































// const jwt = require('jsonwebtoken');

// // Generate JWT token
// const generateToken = (userId, role) => {
//   return jwt.sign(
//     { userId, role }, // Include the role in the token payload
//     process.env.JWT_SECRET,
//     { expiresIn: '1h' } // Token expires in 1 hour
//   );
// };

// // Generate Refresh Token
// const generateRefreshToken = (userId, role) => {
//   return jwt.sign(
//     { userId, role },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: '7d' } // Refresh token expires in 7 days
//   );
// };

// // Middleware to protect routes
// const protect = (req, res, next) => {
//   let token;

//   // Check if the token is in the headers
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1]; // Extract the token
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error('Not authorized, no token');
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach the decoded data to the request object
//     console.log('Decoded user:', decoded); // Debugging log
//     next();
//   } catch (error) {
//     res.status(401);
//     throw new Error('Not authorized, token failed');
//   }
// };

// // Middleware to check if user is an admin
// const isAdmin = (req, res, next) => {
//   console.log('User role:', req.user.role); // Debugging log
//   if (req.user.role !== 'admin') {
//     res.status(403);
//     throw new Error('Not authorized as an admin');
//   }
//   next();
// };

// module.exports = { generateToken, generateRefreshToken, protect, isAdmin };