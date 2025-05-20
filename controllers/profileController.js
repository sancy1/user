


// controllers/profileController.js

const asyncHandler = require("express-async-handler");
const upload = require('../middlewares/upload');
const Profile = require('../models/Profile');
const path = require('path');
const fs = require('fs');
const {
  createProfileService,
  getProfileService,
  updateProfileService,
  deleteProfileService,
} = require("../services/profileServices");

// Auto-create profile for a user
const createProfile = asyncHandler(async (userId, username, profileImage = null) => {
  if (!userId || !username) {
    const error = new Error("userId and username are required");
    error.statusCode = 400; 
    throw error; 
  }
  return await createProfileService(userId, username, profileImage);
});

// Get user profile
// const getProfile = asyncHandler(async (req, res) => {
//   const userId = req.user._id; // Changed from req.user.userId to req.user._id
  
//   const { user, profile } = await getProfileService(userId);
//   res.status(200).json({ user, profile });
// });

const getProfile = asyncHandler(async (req, res) => {
  console.log('Request user:', req.user); // Debug log
  const userId = req.user._id; // This should match what's in your protect middleware
  
  const { user, profile } = await getProfileService(userId);
  res.status(200).json({ user, profile });
});


// Helper function to clean up local image files
const cleanupLocalImage = (imagePath) => {
  if (imagePath && !imagePath.startsWith('http')) {
    const fullPath = path.join(__dirname, '../', imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

// Update user profile
// const updateProfile = asyncHandler(async (req, res) => {
//   const userId = req.user._id; // Changed from req.user.userId to req.user._id
//   const updates = req.body;
  
//   const updatedProfile = await updateProfileService(userId, updates);
//   res.status(200).json(updatedProfile);
// });

// Update user profile with image handling
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let updates = req.body;

  try {
    // Handle file upload if present
    if (req.file) {
      // Get current profile to check for existing image
      const currentProfile = await Profile.findOne({ userId });
      
      // Clean up old image if exists
      cleanupLocalImage(currentProfile?.profileImage);

      // Set new image path
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    // Update the profile in database
    const updatedProfile = await updateProfileService(userId, updates);
    
    res.status(200).json({
      success: true,
      profile: updatedProfile
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});



// Delete user profile
// const deleteProfile = asyncHandler(async (req, res) => {
//   const userId = req.user._id; // Changed from req.user.userId to req.user._id
  
//   await deleteProfileService(userId);
//   res.status(204).json({ message: "Profile deleted successfully" });
// });

// Delete user profile with image cleanup
const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    // Get profile first to access image path
    const profile = await Profile.findOne({ userId });
    
    // Clean up associated image file
    cleanupLocalImage(profile?.profileImage);

    // Delete profile from database
    await deleteProfileService(userId);
    
    res.status(204).json({ 
      success: true,
      message: "Profile and associated image deleted successfully" 
    });

  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});



// Add new endpoint for image upload ----------------------------------------------------------------
const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      message: 'No file uploaded' 
    });
  }

  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { profileImage: `/uploads/${req.file.filename}` },
      { new: true }
    );

    res.status(200).json({
      success: true,
      profileImage: profile.profileImage
    });
  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update profile image'
    });
  }
});


module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  uploadProfileImage
};

















// const asyncHandler = require("express-async-handler");
// const {
//   createProfileService,
//   getProfileService,
//   updateProfileService,
//   deleteProfileService,
// } = require("../services/profileServices");


// // Auto-create profile for a user --------------------------------------------------------------
// const createProfile = asyncHandler(async (userId, username, profileImage = null) => {
//   if (!userId || !username) {
//     const error = new Error("userId and username are required");
//     error.statusCode = 400; 
//     throw error; 
//   }

//   // Call the service to create the profile
//   const profile = await createProfileService(userId, username, profileImage);

//   return profile;
// });


// // Get user profile with user information --------------------------------------------------------------
// const getProfile = asyncHandler(async (req, res) => {
//   const userId = req.user.userId;

//   if (!userId) {
//     const error = new Error("User ID is required");
//     error.statusCode = 400; 
//     throw error; 
//   }

//   const { user, profile } = await getProfileService(userId);

//   res.status(200).json({
//     user, 
//     profile, 
//   });
// });


// // Update user profile --------------------------------------------------------------
// const updateProfile = asyncHandler(async (req, res) => {
//   const userId = req.user.userId;
//   const { name, address, profileImage, biography, professionalInfo } = req.body;

//   if (!userId) {
//     const error = new Error("User ID is required");
//     error.statusCode = 400; 
//     throw error; 
//   }

//   if (Object.keys(req.body).length === 0) {
//     const error = new Error("Request body is required");
//     error.statusCode = 400; 
//     throw error; 
//   }

//   const profile = await updateProfileService(userId, {
//     name,
//     address,
//     profileImage,
//     biography,
//     professionalInfo,
//   });

//   res.status(200).json(profile);
// });


// // Delete user profile and account --------------------------------------------------------------
// const deleteProfile = asyncHandler(async (req, res) => {
//   const userId = req.user.userId;

//   if (!userId) {
//     const error = new Error("User ID is required");
//     error.statusCode = 400; 
//     throw error; 
//   }

//   const result = await deleteProfileService(userId);

//   res.status(200).json(result);
// });

// module.exports = {
//   createProfile,
//   getProfile,
//   updateProfile,
//   deleteProfile,
// };


































// const asyncHandler = require("express-async-handler");
// const Profile = require("../models/Profile");
// const User = require("../models/User");
// const generateAvatar = require("../utils/avatarGenerator");

// // Auto-create profile for a user
// const createProfile = asyncHandler(async (userId, username, profileImage = null) => {
//   if (!userId) {
//     const error = new Error("userId is missing in createProfile()");
//     error.statusCode = 400; // Set a custom status code
//     throw error; 
//   }

//   // Use the provided profileImage or generate a default one using the avatar generator
//   const image = profileImage || generateAvatar(username);

//   const profile = new Profile({
//     userId,
//     name: username,
//     biography: "", // Add default value
//     professionalInfo: "", // Add default value
//     profileImage: image,
//   });
//   await profile.save();

//   // Update user with profile reference
//   await User.findByIdAndUpdate(userId, { profile: profile._id });

//   return profile;
// });

// // Get user profile with user information
// const getProfile = asyncHandler(async (req, res) => {
//   const profile = await Profile.findOne({ userId: req.user.userId });

//   if (!profile) {
//     const error = new Error("Profile not found");
//     error.statusCode = 404; // Set a custom status code
//     throw error; 
//   }

//   const user = await User.findById(profile.userId).select("-password"); // Exclude the password field

//   if (!user) {
//     const error = new Error("User not found");
//     error.statusCode = 404; // Set a custom status code
//     throw error; 
//   }

//   res.status(200).json({
//     user: user, // User data first
//     profile: profile, // Then profile data
//   });
// });

// // Update user profile
// const updateProfile = asyncHandler(async (req, res) => {
//   const { name, address, profileImage, biography, professionalInfo } = req.body;

//   // Check if the request body is empty
//   if (Object.keys(req.body).length === 0) {
//     const error = new Error("Request body is required");
//     error.statusCode = 400; // Set a custom status code
//     throw error; 
//   }

//   const profile = await Profile.findOneAndUpdate(
//     { userId: req.user.userId }, // Access userId from req.user
//     { name, address, profileImage, biography, professionalInfo },
//     { new: true }
//   );

//   if (!profile) {
//     const error = new Error("Profile not found");
//     error.statusCode = 404; // Set a custom status code
//     throw error; 
//   }

//   res.status(200).json(profile);
// });

// // Delete user profile and account
// const deleteProfile = asyncHandler(async (req, res) => {
//   const profile = await Profile.findOneAndDelete({ userId: req.user.userId }); // Access userId from req.user

//   if (!profile) {
//     const error = new Error("Profile not found");
//     error.statusCode = 404; // Set a custom status code
//     throw error; 
//   }

//   await User.findByIdAndDelete(req.user.userId);

//   res.status(200).json({ message: "Profile and user account deleted successfully" });
// });

// module.exports = {
//   createProfile,
//   getProfile,
//   updateProfile,
//   deleteProfile,
// };






































// // controllers/profileController.js
// const asyncHandler = require('express-async-handler');
// const Profile = require('../models/Profile');
// const User = require('../models/User');
// const generateAvatar = require('../utils/avatarGenerator');

// // Auto-create profile for a user
// const createProfile = asyncHandler(async (userId, username, profileImage = null) => {
//     if (!userId) {
//         throw new Error('userId is missing in createProfile()');
//     }

//     // Use the provided profileImage or generate a default one using the avatar generator
//     const image = profileImage || generateAvatar(username);

//     const profile = new Profile({
//         userId,
//         name: username,
//         biography: '', // Add default value
//         professionalInfo: '', // Add default value
//         profileImage: image,
//     });
//     await profile.save();

//     // Update user with profile reference
//     await User.findByIdAndUpdate(userId, { profile: profile._id });

//     return profile;
// });


// // Get user profile with user information
// const getProfile = asyncHandler(async (req, res) => {
//     const profile = await Profile.findOne({ userId: req.user.userId });

//     if (profile) {
//         const user = await User.findById(profile.userId).select('-password'); // Exclude the password field

//         if (user) {
//             res.status(200).json({
//                 user: user, // User data first
//                 profile: profile, // Then profile data
//             });
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     } else {
//         res.status(404).json({ message: 'Profile not found' });
//     }
// });


// // Update user profile
// const updateProfile = asyncHandler(async (req, res) => {
//     const { name, address, profileImage, biography, professionalInfo } = req.body;
  
//     // Check if the request body is empty
//     if (Object.keys(req.body).length === 0) {
//       return res.status(400).json({ message: "Request body is required" });
//     }
  
//     const profile = await Profile.findOneAndUpdate(
//       { userId: req.user.userId }, // Access userId from req.user
//       { name, address, profileImage, biography, professionalInfo },
//       { new: true }
//     );
  
//     if (profile) {
//       res.status(200).json(profile);
//     } else {
//       res.status(404).json({ message: "Profile not found" });
//     }
//   });

// // Delete user profile and account
// const deleteProfile = asyncHandler(async (req, res) => {
//     await Profile.findOneAndDelete({ userId: req.user.userId }); // Access userId from req.user
//     await User.findByIdAndDelete(req.user.userId);
//     res.status(200).json({ message: 'Profile and user account deleted successfully' });
// });

// module.exports = {
//     createProfile,
//     getProfile,
//     updateProfile,
//     deleteProfile,
// };
