const asyncHandler = require("express-async-handler");
const Profile = require("../models/Profile");
const User = require("../models/User");
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
const getProfileService = async (userId) => {
  try {
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      const error = new Error("Profile not found");
      error.statusCode = 404; 
      throw error; 
    }

    const user = await User.findById(profile.userId).select("-password"); 

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404; 
      throw error; 
    }

    return { user, profile };
  } catch (error) {
    console.error("Error in getProfileService:", error);
    throw error; 
  }
};


// Update user profile --------------------------------------------------------------
const updateProfileService = async (userId, updates) => {
  try {
    if (Object.keys(updates).length === 0) {
      const error = new Error("Request body is required");
      error.statusCode = 400; 
      throw error; 
    }

    const profile = await Profile.findOneAndUpdate(
      { userId }, 
      updates,
      { new: true }
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
const deleteProfileService = async (userId) => {
  try {
    const profile = await Profile.findOneAndDelete({ userId }); 

    if (!profile) {
      const error = new Error("Profile not found");
      error.statusCode = 404; 
      throw error; 
    }

    await User.findByIdAndDelete(userId);

    return { message: "Profile and user account deleted successfully" };
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