// validator/resetPasswordValidator.js

const { body } = require('express-validator');

// Helper functions (same as before)
const isCommonPattern = (value) => {
  const commonPatterns = [
    '123456', 'password', 'qwerty', 'abcdef', 'asdfgh',
    '12345', '123456789', '111111', '123123', 'admin'
  ];
  return !commonPatterns.includes(value.toLowerCase());
};

const hasExcessiveRepetition = (value) => {
  return !/(.)\1{2,}/.test(value);
};

const hasNoWhitespace = (value) => {
  return !/\s/.test(value);
};

// Password validation rules for reset password
const resetPasswordValidationRules = [
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 12 }).withMessage('New password must be at least 12 characters long')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('New password must contain at least one numeric digit')
    .matches(/[!@#$%^&*()\-_+=[\]{}|;:'",.<>/?]/).withMessage('New password must contain at least one special character')
    .custom(isCommonPattern).withMessage('New password must not contain common patterns')
    .custom(hasExcessiveRepetition).withMessage('New password must not contain excessive repetition')
    .custom(hasNoWhitespace).withMessage('New password must not contain whitespace'),
  body('confirmNewPassword')
    .notEmpty().withMessage('Confirm new password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

module.exports = resetPasswordValidationRules;