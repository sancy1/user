
const errorHandler = (error, req, res, next) => {
  // Log the error for debugging
  console.error("Error:", error);

  // Default status code and message
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";

  // Handle specific error types
  if (error.name === "ValidationError") {
    // Handle Mongoose validation errors
    statusCode = 400;
    message = Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");

  } else if (error.code === 11000) {
    // Handle MongoDB duplicate key errors
    statusCode = 409;
    message = "Duplicate entry detected.";

  } else if (error.name === "CastError") {
    // Handle Mongoose CastError (e.g., invalid ObjectId)
    statusCode = 400;
    message = "Invalid resource ID.";

  } else if (error.name === "UnauthorizedError") {
    // Handle JWT authentication errors
    statusCode = 401;
    message = "Unauthorized access.";
  }

  // Send the error response --------------------------------------------------------------
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack, 
  });
};

module.exports = errorHandler;



























// const errorHandler = (error, req, res, next) => {
//     let statusCode = error.status || 500;
//     let message = error.message || "Internal Server Error";
  
//     // Handle MongoDB Duplicate Key Error
//     if (error.code === 11000) {
//       statusCode = 409;
//       message = "Duplicate entry detected.";
//     }
  
//     res.status(statusCode).json({
//       success: false,
//       message,
//       stack: process.env.NODE_ENV === "production" ? null : error.stack, // Hide stack trace in production
//     });
//   };
  
//   module.exports = errorHandler;
  







