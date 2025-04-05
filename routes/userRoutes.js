
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/auth');
const { validationResult } = require('express-validator');
const resetPasswordValidationRules = require('../validators/resetPasswordValidator');
const {
  registerUser,
  verifyEmail,
  loginUser,
  changePassword,
  deleteUser,
  deleteAllUsers,
  deleteSingleUser,
  getAllUsers,
  getSingleUser,
  getAccountInfo,
  updateUserRole,
  refreshAccessToken,
  logoutUser,
  resendVerificationEmail,
  getUnverifiedUsers,
  deleteUnverifiedUsers,
  deleteAllUsersExceptAdmin,
  forgotPassword,
  resetPassword,
  validateResetToken,
} = require('../controllers/userController');

const {userValidationRules} = require('../validators/userValidator');
const validate = require('../middlewares/validate');


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     oAuthSample:  # OAuth 2.0 security scheme
 *       type: oauth2
 *       description: This API uses OAuth 2.0 with the implicit grant flow.
 *       flows:
 *         implicit:  # OAuth flow (authorizationCode, implicit, password, or clientCredentials)
 *           authorizationUrl: https://api.example.com/oauth2/authorize  # Replace with your authorization URL
 *           scopes:
 *             read_users: Read user information
 *             write_users: Modify user information
 *     bearerAuth:  # Bearer token security scheme
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT  # Optional, for documentation purposes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomUser:
 *       type: object
 *       description: A custom user object with extended properties
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "5f8d0d55b54764421b7156c3"
 *           description: Unique identifier for the user
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           example: "johndoe42"
 *           description: Unique username for authentication
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *           description: User's primary email address
 *         role:
 *           type: string
 *           enum: [user, admin, moderator]
 *           default: "user"
 *           description: User's access level
 *         isVerified:
 *           type: boolean
 *           default: false
 *           description: Email verification status
 *         profile:
 *           $ref: '#/components/schemas/Profile'
 *         preferences:
 *           type: object
 *           properties:
 *             theme:
 *               type: string
 *               enum: [light, dark, system]
 *               default: "light"
 *             notifications:
 *               type: object
 *               properties:
 *                 email:
 *                   type: boolean
 *                   default: true
 *                 push:
 *                   type: boolean
 *                   default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-15T09:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-20T14:45:00Z"
 *       required:
 *         - username
 *         - email
 *         - role
 *       example:
 *         id: "5f8d0d55b54764421b7156c3"
 *         username: "johndoe42"
 *         email: "john.doe@example.com"
 *         role: "user"
 *         isVerified: true
 *         profile:
 *           firstName: "John"
 *           lastName: "Doe"
 *           bio: "Software engineer and open source contributor"
 *         preferences:
 *           theme: "dark"
 *           notifications:
 *             email: true
 *             push: false
 *         createdAt: "2023-01-15T09:30:00Z"
 *         updatedAt: "2023-01-20T14:45:00Z"
 * 
 * 
 * 
 *   tags:
 *     - name: Custom User
 *       description: Operations for extended user properties and management
 */



/**
 * @swagger
 * /users/register:
 *   post:
 *     tags: [Custom User] 
 *     summary: Register a new user
 *     description: Register a new user with username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: john_doe
 *               email: john.doe@example.com
 *               password: Password123!
 *               confirmPassword: securePassword123
 *               
 *     responses:
 *       201:
 *         description: User registered successfully. Please check your email for verification.
 *       400:
 *         description: Invalid input or user already exists.
 */
router.post('/register', userValidationRules(), validate, registerUser);

/**
 * @swagger
 * /users/admin/unverified:
 *   get:
 *     tags: [Custom User] 
 *     summary: Get all unverified users (Admin Only)
 *     description: Allows an admin to fetch all users who have not verified their email.
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - read_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer token security
 *     responses:
 *       200:
 *         description: Returns a list of all unverified users.
 *       403:
 *         description: User is not an admin.
 */
router.get('/admin/unverified', protect, isAdmin, getUnverifiedUsers);

/**
 * @swagger
 * /users/verify-email:
 *   get:
 *     tags: [Custom User] 
 *     summary: Verify user email
 *     description: Verify a user's email address using the verification token sent to their email.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *       400:
 *         description: Invalid or expired token.
 */
router.get('/verify-email', verifyEmail);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Custom User] 
 *     summary: Login user
 *     description: Authenticate a user and return a JWT token for accessing protected routes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: john.doe@example.com
 *               password: Password123!
 *     responses:
 *       200:
 *         description: User logged in successfully. Returns a JWT token.
 *       401:
 *         description: Invalid email, password, or email not verified.
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /users/admin/delete-unverified:
 *   delete:
 *     tags: [Custom User] 
 *     summary: Delete all unverified users (Admin Only)
 *     description: Allows an admin to delete all users who have not verified their email.
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - write_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer token security
 *     responses:
 *       200:
 *         description: Unverified users deleted successfully.
 *       403:
 *         description: User is not an admin.
 */
router.delete('/admin/delete-unverified', protect, isAdmin, deleteUnverifiedUsers);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     tags: [Custom User] 
 *     summary: Change user password
 *     description: Allows a logged-in user to change their password.
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - write_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer token security
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               currentPassword: OldPassword123!
 *               newPassword: NewPassword123!
 *               confirmNewPassword: newSecurePassword789
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       401:
 *         description: Invalid current password or user not logged in.
 *       400:
 *         description: Invalid input or missing fields.
 */
router.put('/change-password', protect, changePassword);

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     tags: [Custom User] 
 *     summary: Delete user account
 *     description: Allows a logged-in user to delete their own account.
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - write_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer token security
 *     responses:
 *       200:
 *         description: User account deleted successfully.
 *       401:
 *         description: User not logged in.
 */
router.delete('/delete', protect, deleteUser);

/**
 * @swagger
 * /users/account:
 *   get:
 *     tags: [Custom User] 
 *     summary: Get account info
 *     description: Allows a logged-in user to view their own account information.
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - read_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer token security
 *     responses:
 *       200:
 *         description: Returns the user's account information.
 *       401:
 *         description: User not logged in.
 */
router.get('/account', protect, getAccountInfo);

/**
 * @swagger
 * /users/admin/delete-all:
 *   delete:
 *     tags: [Custom User] 
 *     summary: Delete all users (Admin Only)
 *     description: Allows an admin to delete all users.
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - write_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer token security
 *     responses:
 *       200:
 *         description: All users deleted successfully.
 *       403:
 *         description: User is not an admin.
 */
router.delete('/admin/delete-all', protect, isAdmin, deleteAllUsers);

/**
 * @swagger
 * /users/admin/delete/{userId}:
 *   delete:
 *     tags: [Custom User] 
 *     summary: Delete a single user (Admin Only)
 *     description: Allows an admin to delete a single user by their ID.
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - write_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer token security
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       403:
 *         description: User is not an admin.
 *       404:
 *         description: User not found.
 */
router.delete('/admin/delete/:userId', protect, isAdmin, deleteSingleUser);

/**
 * @swagger
 * /users/admin/all:
 *   get:
 *     tags: [Custom User] 
 *     summary: Get all users (Admin Only)
 *     description: Allows an admin to fetch all users.
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - read_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer token security
 *     responses:
 *       200:
 *         description: Returns a list of all users.
 *       403:
 *         description: User is not an admin.
 */
router.get('/admin/all', protect, isAdmin, getAllUsers);

/**
 * @swagger
 * /users/admin/{userId}:
 *   get:
 *     tags: [Custom User] 
 *     summary: Get a single user (Admin Only)
 *     description: Allows an admin to fetch a single user by their ID.
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - read_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer token security
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the user details.
 *       403:
 *         description: User is not an admin.
 *       404:
 *         description: User not found.
 */
router.get('/admin/:userId', protect, isAdmin, getSingleUser);

/**
 * @swagger
 * /users/admin/update-role/{userId}:
 *   put:
 *     tags: [Custom User] 
 *     summary: Update user role (Admin Only)
 *     description: Allows an admin to update the role of a user (e.g., change from 'user' to 'admin').
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - write_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer token security
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *             example:
 *               role: admin
 *     responses:
 *       200:
 *         description: User role updated successfully.
 *       400:
 *         description: Invalid role or missing fields.
 *       403:
 *         description: User is not an admin.
 *       404:
 *         description: User not found.
 */
router.put('/admin/update-role/:userId', protect, isAdmin, updateUserRole);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     tags: [Custom User] 
 *     summary: Refresh access token
 *     description: Refreshes the access token using a valid refresh token.
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - read_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer token security
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: your_refresh_token_here
 *     responses:
 *       200:
 *         description: New access token and refresh token generated successfully.
 *       400:
 *         description: Bad request. Invalid or expired refresh token.
 *       500:
 *         description: Internal server error.
 */
router.post('/refresh-token', refreshAccessToken);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     tags: [Custom User] 
 *     summary: Logout user
 *     description: Logs out the user by invalidating their access token.
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - write_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer token security
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *       401:
 *         description: Unauthorized. Missing or invalid access token.
 *       500:
 *         description: Internal server error.
 */
router.post('/logout', protect, logoutUser);

/**
 * @swagger
 * /users/resend-verification-email:
 *   post:
 *     tags: [Custom User] 
 *     summary: Resend verification email
 *     description: Resend the verification email to the user's email address.
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - write_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer token security
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: john.doe@example.com
 *     responses:
 *       200:
 *         description: Verification email resent successfully.
 *       400:
 *         description: Email is already verified.
 *       404:
 *         description: User not found.
 */
router.post('/resend-verification-email', resendVerificationEmail);


/**
 * @swagger
 * /users/admin/delete-all-except-admin:
 *   delete:
 *     tags: [Custom User] 
 *     summary: Delete all users except admin (Admin Only)
 *     description: Allows an admin to delete all users except those with the 'admin' role.
 *     security:
 *       - oAuthSample:  # Apply OAuth 2.0 security
 *         - write_users  # Required scope
 *       - bearerAuth: []  # Apply Bearer Authentication
 *     responses:
 *       200:
 *         description: All users except admin deleted successfully.
 *       403:
 *         description: User is not an admin.
 */
router.delete('/admin/delete-all-except-admin', protect, isAdmin, deleteAllUsersExceptAdmin);


/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     tags: [Custom User] 
 *     summary: Request a password reset
 *     description: Sends a password reset link to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', forgotPassword);


/**
 * @swagger
 * /users/reset-password:
 *   get:
 *     tags: [Custom User] 
 *     summary: Validate reset password token
 *     description: Validates the reset password token and returns a success message if valid.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token is valid
 *       400:
 *         description: Invalid or expired token
 */
router.get('/reset-password', validateResetToken);



/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     tags: [Custom User] 
 *     summary: Reset user password
 *     description: Resets the user's password using the token sent to their email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *               - confirmNewPassword
 *               - userId
 *             properties:
 *               token:
 *                 type: string
 *                 description: The password reset token received via email.
 *                 example: "abc123"
 *               newPassword:
 *                 type: string
 *                 description: The new password to set.
 *                 example: "newPassword123"
 *               confirmNewPassword:
 *                 type: string
 *                 description: Confirm the new password (must match newPassword).
 *                 example: "newPassword123"
 *               userId:
 *                 type: string
 *                 description: The ID of the user whose password is being reset.
 *                 example: "1c0f95ed-a5b5-43cc-8cab-f90f1287ab6a"
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully"
 *       400:
 *         description: Invalid or expired token, or passwords do not match.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired token"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/reset-password', resetPasswordValidationRules, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next(); // Proceed to the resetPassword controller if validation passes
}, resetPassword); // Include resetPassword controller


module.exports = router;



