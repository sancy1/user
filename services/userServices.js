const User = require("../models/User");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../services/emailService");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Register User --------------------------------------------------------------
const registerUserService = async (username, email, password) => {
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("User already exists");
      error.statusCode = 400; 
      throw error;
    }

    const user = await User.create({ username, email, password });

    const verificationToken = crypto.randomBytes(40).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    await sendVerificationEmail(email, verificationToken, username);

    return user;
  } catch (error) {
    console.error("Error in registerUserService:", error);
    throw error; 
  }
};


// Verify Email --------------------------------------------------------------
const verifyEmailService = async (token) => {
  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 400; 
      throw error;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return user;
  } catch (error) {
    console.error("Error in verifyEmailService:", error);
    throw error; 
  }
};


// Login User --------------------------------------------------------------
const loginUserService = async (email, password) => {
  try {
    const user = await User.findOne({ email: email.trim() });

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    const passwordMatch = await bcrypt.compare(password.trim(), user.password);

    if (!passwordMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    if (!user.isVerified) {
      const error = new Error("Please verify your email to login");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    user.refreshToken = refreshToken;
    await user.save();

    return { user, token, refreshToken };
  } catch (error) {
    console.error("Error in loginUserService:", error);
    throw error; 
  }
};


// Refresh Access Token --------------------------------------------------------------
const refreshAccessTokenService = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      const error = new Error("Invalid refresh token");
      error.statusCode = 403; 
      throw error;
    }

    const newAccessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return { token: newAccessToken };
  } catch (error) {
    console.error("Error in refreshAccessTokenService:", error);
    throw error; 
  }
};


// Logout User --------------------------------------------------------------
const logoutUserService = async (refreshToken) => {
  try {
    const user = await User.findOne({ refreshToken });

    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
  } catch (error) {
    console.error("Error in logoutUserService:", error);
    throw error; 
  }
};


// Change Password --------------------------------------------------------------
const changePasswordService = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404; 
      throw error;
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      const error = new Error("Invalid current password");
      error.statusCode = 400; 
      throw error;
    }

    user.password = newPassword;
    await user.save();
  } catch (error) {
    console.error("Error in changePasswordService:", error);
    throw error;
  }
};


// Delete User --------------------------------------------------------------
const deleteUserService = async (userId) => {
  try {
    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      const error = new Error("User not found");
      error.statusCode = 404; 
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteUserService:", error);
    throw error; 
  }
};


// Admin: Delete All Users --------------------------------------------------------------
const deleteAllUsersService = async () => {
  try {
    await User.deleteMany({});
  } catch (error) {
    console.error("Error in deleteAllUsersService:", error);
    throw error; 
  }
};


// Admin: Delete All Users Except Admins --------------------------------------------------------------
const deleteAllUsersExceptAdminService = async () => {
  try {
    const deleteResult = await User.deleteMany({ role: { $ne: "admin" } });
    return deleteResult.deletedCount;
  } catch (error) {
    console.error("Error in deleteAllUsersExceptAdminService:", error);
    throw error; 
  }
};


// Admin: Delete Single User --------------------------------------------------------------
const deleteSingleUserService = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404; 
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteSingleUserService:", error);
    throw error; 
  }
};


// Admin: Get All Users --------------------------------------------------------------
const getAllUsersService = async () => {
  try {
    return await User.find({});
  } catch (error) {
    console.error("Error in getAllUsersService:", error);
    throw error; 
  }
};


// Admin: Get Single User --------------------------------------------------------------
const getSingleUserService = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404; 
      throw error;
    }

    return user;
  } catch (error) {
    console.error("Error in getSingleUserService:", error);
    throw error; 
  }
};


// Get Account Info --------------------------------------------------------------
const getAccountInfoService = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404; 
      throw error;
    }

    return user;
  } catch (error) {
    console.error("Error in getAccountInfoService:", error);
    throw error; 
  }
};


// Update User Role (Admin Only) --------------------------------------------------------------
const updateUserRoleService = async (userId, role) => {
  try {
    if (!["user", "admin"].includes(role)) {
      const error = new Error("Invalid role. Role must be either 'user' or 'admin'.");
      error.statusCode = 400; 
      throw error;
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404; 
      throw error;
    }

    user.role = role;
    await user.save();
  } catch (error) {
    console.error("Error in updateUserRoleService:", error);
    throw error; 
  }
};

// Resend Verification Email --------------------------------------------------------------
const resendVerificationEmailService = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404; 
      throw error;
    }

    if (user.isVerified) {
      const error = new Error("Email is already verified");
      error.statusCode = 400; 
      throw error;
    }

    const verificationToken = crypto.randomBytes(40).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 86400000; // 24 hours in milliseconds
    await user.save();

    await sendVerificationEmail(user.email, verificationToken, user.username);
  } catch (error) {
    console.error("Error in resendVerificationEmailService:", error);
    throw error; 
  }
};


// Admin: Get All Unverified Users --------------------------------------------------------------
const getUnverifiedUsersService = async () => {
  try {
    return await User.find({ isVerified: false });
  } catch (error) {
    console.error("Error in getUnverifiedUsersService:", error);
    throw error; 
  }
};


// Admin: Delete Unverified Users --------------------------------------------------------------
const deleteUnverifiedUsersService = async () => {
  try {
    const result = await User.deleteMany({ isVerified: false });

    if (result.deletedCount === 0) {
      const error = new Error("No unverified users found");
      error.statusCode = 404; 
      throw error;
    }

    return result.deletedCount;
  } catch (error) {
    console.error("Error in deleteUnverifiedUsersService:", error);
    throw error; 
  }
};


// Forgot Password: Generate and send reset token --------------------------------------------------------------
const forgotPasswordService = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404; 
      throw error;
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 86400000; // 24 hours in milliseconds

    const hashedToken = await bcrypt.hash(resetToken, 10);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken, user.username);
  } catch (error) {
    console.error("Error in forgotPasswordService:", error);
    throw error; 
  }
};


// Validate Token and return user ID --------------------------------------------------------------
const validateResetTokenService = async (token) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: { $exists: true },
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 400; 
      throw error;
    }

    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 400; 
      throw error;
    }

    return user._id;
  } catch (error) {
    console.error("Error in validateResetTokenService:", error);
    throw error; 
  }
};


// Reset Password: Update password using the token and user ID --------------------------------------------------------------
const resetPasswordService = async (userId, token, newPassword) => {
  try {
    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: { $exists: true },
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 400; 
      throw error;
    }

    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 400; 
      throw error;
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
  } catch (error) {
    console.error("Error in resetPasswordService:", error);
    throw error; 
  }
};

module.exports = {
  registerUserService,
  verifyEmailService,
  loginUserService,
  refreshAccessTokenService,
  logoutUserService,
  changePasswordService,
  deleteUserService,
  deleteAllUsersService,
  deleteSingleUserService,
  getAllUsersService,
  getSingleUserService,
  getAccountInfoService,
  updateUserRoleService,
  resendVerificationEmailService,
  getUnverifiedUsersService,
  deleteUnverifiedUsersService,
  deleteAllUsersExceptAdminService,
  forgotPasswordService,
  resetPasswordService,
  validateResetTokenService,
};