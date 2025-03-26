const { validationResult } = require("express-validator");

// Middleware to handle validation errors --------------------------------------------------------------
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next(); 
  }

  // Log validation errors for debugging
  console.error("Validation errors:", errors.array());


  // Extract and format errors --------------------------------------------------------------
  const extractedErrors = errors.array().map((err) => ({
    field: err.param, 
    message: err.msg, 
    location: err.location, 
    value: err.value, 
  }));


  // Determine the appropriate status code --------------------------------------------------------------
  const statusCode = extractedErrors.some((err) => err.location === "headers")
    ? 400 
    : 422; 


  // Send the error response --------------------------------------------------------------
  return res.status(statusCode).json({
    success: false,
    message: "Validation failed",
    errors: extractedErrors,
  });
};

module.exports = validate;






























// const { validationResult } = require("express-validator");

// // Middleware to handle validation errors
// const validate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (errors.isEmpty()) {
//     return next();
//   }

//   const extractedErrors = errors.array().map(err => ({ [err.param]: err.msg }));

//   return res.status(422).json({
//     errors: extractedErrors,
//   });
// };

// module.exports = validate;
