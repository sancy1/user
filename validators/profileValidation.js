const { body } = require("express-validator");

// Profile validation rules (Used for PUT)
const profileValidationRules = () => [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("address").optional().isString().withMessage("Address must be a string"),
  body("profileImage").optional().isString().withMessage("Profile image must be a string"),
  body("biography").optional().isString().withMessage("Biography must be a string"),
  body("professionalInfo").optional().isString().withMessage("Professional info must be a string"),
];

module.exports = { profileValidationRules };