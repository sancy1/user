
// const { body } = require('express-validator');
// const User = require('../models/User'); // Ensure you import your User model

// // Helper function to check for common patterns in passwords
// const isCommonPattern = (value) => {
//   const commonPatterns = [
//     '123456', 'password', 'qwerty', 'abcdef', 'asdfgh', 
//     '12345', '123456789', '111111', '123123', 'admin'
//   ];
//   return !commonPatterns.includes(value.toLowerCase());
// };

// // Helper function to check for excessive repetition in passwords
// const hasExcessiveRepetition = (value) => {
//   return !/(.)\1{2,}/.test(value); // No more than 2 identical characters in a row
// };

// // Helper function to check for whitespace in passwords or usernames
// const hasNoWhitespace = (value) => {
//   return !/\s/.test(value);
// };

// // Helper function to check for reserved words in usernames
// const isNotReservedWord = (value) => {
//   const reservedWords = ['admin', 'root', 'user', 'system'];
//   return !reservedWords.includes(value.toLowerCase());
// };

// // Password validation rules
// const passwordValidationRules = [
//   body('password')
//     .notEmpty().withMessage('Password is required')
//     .isLength({ min: 12 }).withMessage('Password must be at least 12 characters long')
//     .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
//     .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
//     .matches(/[0-9]/).withMessage('Password must contain at least one numeric digit')
//     .matches(/[!@#$%^&*()\-_+=[\]{}|;:'",.<>/?]/).withMessage('Password must contain at least one special character')
//     .custom(isCommonPattern).withMessage('Password must not contain common patterns')
//     .custom(hasExcessiveRepetition).withMessage('Password must not contain excessive repetition')
//     .custom(hasNoWhitespace).withMessage('Password must not contain whitespace'),
// ];

// // Username validation rules
// const usernameValidationRules = [
//   body('username')
//     .notEmpty().withMessage('Username is required')
//     .isLength({ min: 4, max: 20 }).withMessage('Username must be between 4 and 20 characters long')
//     .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Username can only contain alphanumeric characters, underscores, hyphens, or periods')
//     .custom(hasNoWhitespace).withMessage('Username must not contain whitespace') // Fixed typo here
//     .custom(isNotReservedWord).withMessage('Username must not be a reserved word')
//     .custom(async (value, { req }) => {
//       // Check if username is unique in the database
//       const user = await User.findOne({ username: value });
//       if (user) {
//         throw new Error('Username is already taken');
//       }
//     }).withMessage('Username must be unique'),
// ];

// // Combine all validation rules
// const userValidationRules = () => [
//   ...usernameValidationRules,
//   body('email').isEmail().withMessage('Invalid email format'),
//   ...passwordValidationRules,
// ];

// module.exports = userValidationRules;
























const { body } = require('express-validator');
const User = require('../models/User'); // Ensure you import your User model

// Helper function to check for common patterns in passwords
const isCommonPattern = (value) => {
  const commonPatterns = [
    '123456', 'password', 'qwerty', 'abcdef', 'asdfgh', 
    '12345', '123456789', '111111', '123123', 'admin'
  ];
  return !commonPatterns.includes(value.toLowerCase());
};

// Helper function to check for excessive repetition in passwords
const hasExcessiveRepetition = (value) => {
  return !/(.)\1{2,}/.test(value); // No more than 2 identical characters in a row
};

// Helper function to check for whitespace in passwords or usernames
const hasNoWhitespace = (value) => {
  return !/\s/.test(value);
};

// Helper function to check for reserved words in usernames
const isNotReservedWord = (value) => {
  const reservedWords = ['admin', 'root', 'user', 'system'];
  return !reservedWords.includes(value.toLowerCase());
};

// Helper function to confirm password match
const confirmPasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
};

// Password validation rules
const passwordValidationRules = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 12 }).withMessage('Password must be at least 12 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one numeric digit')
    .matches(/[!@#$%^&*()\-_+=[\]{}|;:'",.<>/?]/).withMessage('Password must contain at least one special character')
    .custom(isCommonPattern).withMessage('Password must not contain common patterns')
    .custom(hasExcessiveRepetition).withMessage('Password must not contain excessive repetition')
    .custom(hasNoWhitespace).withMessage('Password must not contain whitespace'),
];

// Username validation rules
const usernameValidationRules = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 4, max: 20 }).withMessage('Username must be between 4 and 20 characters long')
    .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Username can only contain alphanumeric characters, underscores, hyphens, or periods')
    .custom(hasNoWhitespace).withMessage('Username must not contain whitespace') // Fixed typo here
    .custom(isNotReservedWord).withMessage('Username must not be a reserved word')
    .custom(async (value, { req }) => {
      // Check if username is unique in the database
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error('Username is already taken');
      }
    }).withMessage('Username must be unique'),
];

// Combine all validation rules
const userValidationRules = () => [
  ...usernameValidationRules,
  body('email').isEmail().withMessage('Invalid email format'),
  ...passwordValidationRules,
];

// Export the confirmPasswordMatch function and validation rules
module.exports = {
  userValidationRules,
  confirmPasswordMatch,
};