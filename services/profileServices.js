const asyncHandler = require("express-async-handler");
const Profile = require("../models/Profile");
const User = require("../models/User");
const path = require('path');
const fs = require('fs');
const generateAvatar = require("../utils/avatarGenerator");


// Auto-create profile for a user --------------------------------------------------------------
const createProfileService = async (userId, username, profileImage = null) => {
  try {
    if (!userId) {
      const error = new Error("userId is missing in createProfile()");
      error.statusCode = 400; 
      throw error; 
    }


    // Use the provided profileImage or generate a default one using the avatar generator --------------------------------------------------------------
    const image = profileImage || generateAvatar(username);

    const profile = new Profile({
      userId,
      name: username,
      biography: "", 
      professionalInfo: "", 
      profileImage: image,
    });
    await profile.save();


    // Update user with profile reference --------------------------------------------------------------
    await User.findByIdAndUpdate(userId, { profile: profile._id });

    return profile;
  } catch (error) {
    console.error("Error in createProfileService:", error);
    throw error; 
  }
};


// Get user profile with user information --------------------------------------------------------------
// const getProfileService = async (userId) => {
//   try {
//     const profile = await Profile.findOne({ userId });

//     if (!profile) {
//       const error = new Error("Profile not found");
//       error.statusCode = 404; 
//       throw error; 
//     }

//     const user = await User.findById(profile.userId).select("-password"); 

//     if (!user) {
//       const error = new Error("User not found");
//       error.statusCode = 404; 
//       throw error; 
//     }

//     return { user, profile };
//   } catch (error) {
//     console.error("Error in getProfileService:", error);
//     throw error; 
//   }
// };

const getProfileService = async (userId) => {
  try {
    console.log('Searching for profile with userId:', userId); // Debug log
    
    const profile = await Profile.findOne({ userId: userId });
    
    if (!profile) {
      console.log('No profile found for userId:', userId); // Debug log
      const error = new Error("Profile not found");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    console.log('Found profile:', profile); // Debug log
    return { user, profile };
  } catch (error) {
    console.error("Error in getProfileService:", error);
    throw error;
  }
};


// Helper function for image cleanup
const cleanupProfileImage = async (userId) => {
  const profile = await Profile.findOne({ userId });
  if (profile?.profileImage && !profile.profileImage.startsWith('http')) {
    const imagePath = path.join(__dirname, '../../', profile.profileImage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};


// Update user profile --------------------------------------------------------------
// const updateProfileService = async (userId, updates) => {
//   try {
//     if (Object.keys(updates).length === 0) {
//       const error = new Error("Request body is required");
//       error.statusCode = 400; 
//       throw error; 
//     }

//     const profile = await Profile.findOneAndUpdate(
//       { userId }, 
//       updates,
//       { new: true }
//     );

//     if (!profile) {
//       const error = new Error("Profile not found");
//       error.statusCode = 404; 
//       throw error; 
//     }

//     return profile;
//   } catch (error) {
//     console.error("Error in updateProfileService:", error);
//     throw error; 
//   }
// };

// Update user profile
const updateProfileService = async (userId, updates) => {
  try {
    if (!userId || Object.keys(updates).length === 0) {
      const error = new Error("User ID and updates are required");
      error.statusCode = 400;
      throw error;
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!profile) {
      const error = new Error("Profile not found");
      error.statusCode = 404;
      throw error;
    }

    return profile;
  } catch (error) {
    console.error("Error in updateProfileService:", error);
    throw error;
  }
};



// Delete user profile and account --------------------------------------------------------------
// const deleteProfileService = async (userId) => {
//   try {
//     const profile = await Profile.findOneAndDelete({ userId }); 

//     if (!profile) {
//       const error = new Error("Profile not found");
//       error.statusCode = 404; 
//       throw error; 
//     }

//     await User.findByIdAndDelete(userId);

//     return { message: "Profile and user account deleted successfully" };
//   } catch (error) {
//     console.error("Error in deleteProfileService:", error);
//     throw error; 
//   }
// };

// Delete user profile and account
const deleteProfileService = async (userId) => {
  try {
    if (!userId) {
      const error = new Error("User ID is required");
      error.statusCode = 400;
      throw error;
    }

    // Clean up profile image first
    await cleanupProfileImage(userId);

    // Delete profile and user
    const [profile, user] = await Promise.all([
      Profile.findOneAndDelete({ userId }),
      User.findByIdAndDelete(userId)
    ]);

    if (!profile || !user) {
      const error = new Error("Profile or User not found");
      error.statusCode = 404;
      throw error;
    }

    return { 
      success: true,
      message: "Profile and user account deleted successfully" 
    };
  } catch (error) {
    console.error("Error in deleteProfileService:", error);
    throw error;
  }
};

module.exports = {
  createProfileService,
  getProfileService,
  updateProfileService,
  deleteProfileService,
};