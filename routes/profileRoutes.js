const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { profileValidationRules } = require("../validators/profileValidation");
const validate = require("../middlewares/validate");
const { uploadProfileImage } = require('../controllers/profileController');
const upload = require('../middlewares/upload');
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



// /**
//  * @swagger
//  * /users/profile:
//  *   put:
//  *     summary: Update user profile (full update)
//  *     description: Replace all profile fields with the provided values
//  *     tags: [Profile]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Profile'
//  *     responses:
//  *       200:
//  *         description: Profile updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Profile'
//  *       400:
//  *         description: Validation error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 errors:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       msg:
//  *                         type: string
//  *                       param:
//  *                         type: string
//  *                       location:
//  *                         type: string
//  *       401:
//  *         description: Unauthorized - Invalid or missing token
//  */
// router.put('/profile', protect, profileValidationRules(), validate, updateProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile (full update with optional image)
 *     description: Replace all profile fields with the provided values, including optional image upload
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (JPG/PNG, max 5MB)
 *               profile:
 *                 type: string
 *                 description: JSON string of profile data
 *                 example: '{"name":"John Doe","biography":"New bio","professionalInfo":"Developer"}'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Validation error or invalid file
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error during file upload
 */
router.put('/profile', protect, upload.single('profileImage'), profileValidationRules(), validate, updateProfile);



// /**
//  * @swagger
//  * /users/profile:
//  *   patch:
//  *     summary: Update user profile (partial update)
//  *     description: Update specific fields of the user's profile
//  *     tags: [Profile]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               firstName:
//  *                 type: string
//  *                 example: John
//  *               lastName:
//  *                 type: string
//  *                 example: Doe
//  *               bio:
//  *                 type: string
//  *                 example: Updated bio information
//  *               avatar:
//  *                 type: string
//  *                 format: uri
//  *                 example: https://example.com/new-avatar.jpg
//  *               location:
//  *                 type: string
//  *                 example: San Francisco, USA
//  *               website:
//  *                 type: string
//  *                 example: https://updated-website.com
//  *     responses:
//  *       200:
//  *         description: Profile updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Profile'
//  *       400:
//  *         description: Validation error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 errors:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       msg:
//  *                         type: string
//  *                       param:
//  *                         type: string
//  *                       location:
//  *                         type: string
//  *       401:
//  *         description: Unauthorized - Invalid or missing token
//  */
// router.patch("/profile", protect, profileValidationRules(), validate, updateProfile);

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update user profile (partial update)
 *     description: Update specific fields of the user's profile without image upload
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
 *               name:
 *                 type: string
 *                 example: John
 *               biography:
 *                 type: string
 *                 example: Updated bio information
 *               professionalInfo:
 *                 type: string
 *                 example: Senior Developer
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.patch('/profile', protect, profileValidationRules(), validate, updateProfile);



// /**
//  * @swagger
//  * /users/profile:
//  *   delete:
//  *     summary: Delete user profile
//  *     description: Permanently delete the user's profile
//  *     tags: [Profile]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       204:
//  *         description: Profile deleted successfully
//  *       401:
//  *         description: Unauthorized - Invalid or missing token
//  *       404:
//  *         description: Profile not found
//  */
// router.delete('/profile', protect, deleteProfile);

/**
 * @swagger
 * /users/profile:
 *   delete:
 *     summary: Delete user profile
 *     description: Permanently delete the user's profile and associated image
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
 *       500:
 *         description: Server error during deletion
 */
router.delete('/profile', protect, deleteProfile);



/**
 * @swagger
 * /users/profile/image:
 *   post:
 *     tags: [Custom User]
 *     summary: Upload profile image
 *     description: Upload a profile image for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (JPG/PNG, max 5MB)
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 profileImage:
 *                   type: string
 *                   description: URL/path to the uploaded image
 *                   example: "/uploads/profile-123456789.jpg"
 *       400:
 *         description: Invalid file or no file uploaded
 *       401:
 *         description: Unauthorized - user not logged in
 *       500:
 *         description: Server error during file upload
 */
router.post('/profile/image', protect, upload.single('profileImage'), uploadProfileImage);


module.exports = router;