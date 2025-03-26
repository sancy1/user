
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/auth');
const { 
    googleAuth, 
    googleAuthCallback, 
    handleGoogleAuthCallback, 
    refreshAccessToken,
    logout,
    switchAccount 
} = require('../controllers/authController');



/**
 * @swagger
 * components:
 *   securitySchemes:
 *     googleOAuth:
 *       type: oauth2
 *       description: Google OAuth2 Authentication
 *       flows:
 *         authorizationCode:
 *           authorizationUrl: https://accounts.google.com/o/oauth2/v2/auth
 *           tokenUrl: https://oauth2.googleapis.com/token
 *           scopes:
 *             email: View your email address
 *             profile: View your basic profile info
 *             openid: Associate you with your personal info
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     GoogleAuthResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Google OAuth access token
 *         refreshToken:
 *           type: string
 *           description: Google OAuth refresh token
 *         idToken:
 *           type: string
 *           description: Google ID token
 *         expiresIn:
 *           type: integer
 *           description: Token expiration time in seconds
 *       example:
 *         accessToken: "ya29.a0AfH6S..."
 *         refreshToken: "1//03gD..."
 *         idToken: "eyJhbGci..."
 *         expiresIn: 3600
 *
 *     TokenRefreshRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Refresh token obtained during initial authentication
 *       example:
 *         refreshToken: "1//03gD..."
 *
 *     TokenRefreshResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: New access token
 *         expiresIn:
 *           type: integer
 *           description: Token expiration time in seconds
 *       example:
 *         accessToken: "ya29.a0AfH6S..."
 *         expiresIn: 3600
 *
 *   tags:
 *     - name: Google OAuth2 Authentication
 *       description: User authentication and authorization
 */

/**
 * @swagger
 * /users/auth/google:
 *   get:
 *     tags: [Google OAuth2 Authentication]
 *     summary: Initiate Google OAuth authentication
 *     description: Redirects user to Google's authentication page
 *     security:
 *       - googleOAuth: [email, profile, openid]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth consent screen
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: Google OAuth URL
 */
router.get('/auth/google', googleAuth);

/**
 * @swagger
 * /users/auth/google/callback:
 *   get:
 *     tags: [Google OAuth2 Authentication]
 *     summary: Google OAuth callback
 *     description: Handles Google's OAuth callback and authenticates the user
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code from Google
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: State parameter for CSRF protection
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoogleAuthResponse'
 *       302:
 *         description: Redirects to frontend with tokens
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: Frontend URL with tokens in query params
 *       400:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/auth/google/callback', googleAuthCallback, handleGoogleAuthCallback);

/**
 * @swagger
 * /users/auth/logout:
 *   post:
 *     tags: [Google OAuth2 Authentication]
 *     summary: Logout user
 *     description: Logs out the user and clears authentication cookies
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully logged out"
 *       401:
 *         description: Unauthorized
 */
router.post('/auth/logout', protect, logout);

/**
 * @swagger
 * /users/auth/switch-account:
 *   get:
 *     tags: [Google OAuth2 Authentication]
 *     summary: Switch user account
 *     description: Allows a logged-in user to switch accounts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       302:
 *         description: Redirects to account selection
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: URL to account selection page
 *       401:
 *         description: Unauthorized
 */
router.get('/auth/switch-account', switchAccount);

/**
 * @swagger
 * /users/auth/refresh-token:
 *   post:
 *     tags: [Google OAuth2 Authentication]
 *     summary: Refresh authentication token
 *     description: Refreshes the access token using a refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TokenRefreshRequest'
 *     responses:
 *       200:
 *         description: Returns a new access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenRefreshResponse'
 *       400:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid refresh token"
 */
router.post('/auth/refresh-token', async (req, res) => {
    const refreshToken = req.body.refreshToken;
    try {
        const tokens = await oauth2Client.refreshAccessToken(refreshToken);
        res.json({ accessToken: tokens.access_token });
    } catch (error) {
        console.error('Token refresh failed:', error);
        res.status(400).json({ message: 'Invalid refresh token' });
    }
});

module.exports = router;
