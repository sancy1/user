const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { profileValidationRules } = require("../validators/profileValidation");
const validate = require("../middlewares/validate");
const {
    getProfile, 
    updateProfile,
    deleteProfile,
} = require('../controllers/profileController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         bio:
 *           type: string
 *           example: Software developer and tech enthusiast
 *         avatar:
 *           type: string
 *           format: uri
 *           example: https://example.com/avatar.jpg
 *         location:
 *           type: string
 *           example: New York, USA
 *         website:
 *           type: string
 *           example: https://johndoe.dev
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   tags:
 *     - name: Profile
 *       description: Standard profile operations
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the authenticated user's profile information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful profile retrieval
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Profile not found
 */
router.get('/profile', protect, getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile (full update)
 *     description: Replace all profile fields with the provided values
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.put('/profile', protect, profileValidationRules(), validate, updateProfile);

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update user profile (partial update)
 *     description: Update specific fields of the user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               bio:
 *                 type: string
 *                 example: Updated bio information
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/new-avatar.jpg
 *               location:
 *                 type: string
 *                 example: San Francisco, USA
 *               website:
 *                 type: string
 *                 example: https://updated-website.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.patch("/profile", protect, profileValidationRules(), validate, updateProfile);

/**
 * @swagger
 * /users/profile:
 *   delete:
 *     summary: Delete user profile
 *     description: Permanently delete the user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Profile not found
 */
router.delete('/profile', protect, deleteProfile);

module.exports = router;