const asyncHandler = require("express-async-handler");
const {
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
} = require("../services/userServices");
const { createProfile } = require("../controllers/profileController");
const { confirmPasswordMatch } = require("../validators/userValidator");


// Register User --------------------------------------------------------------
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Password match
  confirmPasswordMatch(password, confirmPassword);

  const user = await registerUserService(username, email, password);

  if (!user) {
    const error = new Error("Failed to register user");
    error.statusCode = 500; 
    throw error;
  }

  await createProfile(user._id, user.username);

  res.status(201).json({
    message: "User registered successfully. Please check your email for verification.",
  });
});


// Verify Email --------------------------------------------------------------
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    const error = new Error("Token is required");
    error.statusCode = 400; 
    throw error;
  }

  const user = await verifyEmailService(token);

  if (!user) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 400; 
    throw error;
  }

  res.status(200).json({ message: "Email verified successfully" });
});




// const verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   try {
//     const user = await verifyEmailService(token); // Your verification logic

//     if (!user) {
//       // Redirect to FRONTEND with error
//       return res.redirect(`${process.env.FRONTEND_URL}/verify-email?error=Invalid+token`);
//     }

//     // ✅ SUCCESS: Redirect to FRONTEND (not backend!)
//     return res.redirect(`${process.env.FRONTEND_URL}/verify-email?verified=true`);
//   } catch (error) {
//     // Redirect to FRONTEND with error
//     return res.redirect(`${process.env.FRONTEND_URL}/verify-email?error=${encodeURIComponent(error.message)}`);
//   }
// };




// const verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   try {
//     const user = await verifyEmailService(token);

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         error: "INVALID_TOKEN", // Standardized error code
//         message: "Email verification token is invalid or expired.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Email verified successfully.",
//       user: { 
//         id: user._id, 
//         email: user.email 
//       },
//       redirectTo: "/dashboard", // Optional suggestion
//     });

//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       error: "VERIFICATION_FAILED", // Standardized error code
//       message: error.message || "Email verification failed.",
//     });
//   }
// };





// Login User --------------------------------------------------------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400; 
    throw error;
  }

  const { user, token, refreshToken } = await loginUserService(email, password);

  if (!user || !token || !refreshToken) {
    const error = new Error("Failed to login");
    error.statusCode = 401; 
    throw error;
  }

  // res.cookie("refreshToken", refreshToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   path: "/",
  //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  // });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // false for localhost, true in production
    sameSite: 'lax', // 'lax' for localhost, 'none' in production
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token,
    refreshToken,
  });
});



// Refresh Access Token --------------------------------------------------------------
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    const error = new Error("Refresh token is required");
    error.statusCode = 400; 
    throw error;
  }

  const { token } = await refreshAccessTokenService(refreshToken);

  if (!token) {
    const error = new Error("Failed to refresh access token");
    error.statusCode = 401; 
    throw error;
  }

  res.json({ token });
});


// Logout User --------------------------------------------------------------
const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    const error = new Error("Refresh token is required");
    error.statusCode = 400; 
    throw error;
  }

  await logoutUserService(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
});


// Change Password --------------------------------------------------------------
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const userId = req.user.userId;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    const error = new Error("All fields are required");
    error.statusCode = 400; 
    throw error;
  }

  // Password match
  confirmPasswordMatch(newPassword, confirmNewPassword);

  await changePasswordService(userId, currentPassword, newPassword);

  res.status(200).json({ message: "Password changed successfully" });
});


// Delete User --------------------------------------------------------------
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400; 
    throw error;
  }

  await deleteUserService(userId);

  res.status(200).json({ message: "User account and all associated data deleted successfully" });
});


// Admin: Delete All Users --------------------------------------------------------------
const deleteAllUsers = asyncHandler(async (req, res) => {
  await deleteAllUsersService();

  res.status(200).json({ message: "All users deleted successfully" });
});


// Admin: Delete Single User --------------------------------------------------------------
const deleteSingleUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400; 
    throw error;
  }

  await deleteSingleUserService(userId);

  res.status(200).json({ message: "User deleted successfully" });
});


// Admin: Get All Users --------------------------------------------------------------
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();

  if (!users || users.length === 0) {
    const error = new Error("No users found");
    error.statusCode = 404; // Not Found
    throw error;
  }

  res.status(200).json(users);
});


// Admin: Get Single User --------------------------------------------------------------
const getSingleUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400; 
    throw error;
  }

  const user = await getSingleUserService(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404; // Not Found
    throw error;
  }

  res.status(200).json(user);
});


// Get Account Info --------------------------------------------------------------
const getAccountInfo = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400; 
    throw error;
  }

  const user = await getAccountInfoService(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404; // Not Found
    throw error;
  }

  res.status(200).json(user);
});


// Update User Role (Admin Only) --------------------------------------------------------------
const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!userId || !role) {
    const error = new Error("User ID and role are required");
    error.statusCode = 400; 
    throw error;
  }

  await updateUserRoleService(userId, role);

  res.status(200).json({ message: "Role updated successfully" });
});



// Resend Verification Email --------------------------------------------------------------
// const resendVerificationEmail = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     const error = new Error("Email is required");
//     error.statusCode = 400; 
//     throw error;
//   }

//   await resendVerificationEmailService(email);

//   res.status(200).json({ message: "Verification email resent successfully" });
// });



// Resend Verification Email --------------------------------------------------------------
// In your userController.js
const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    const error = new Error("Email is required");
    error.statusCode = 400; 
    throw error;
  }

  // 1. Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User with this email not found");
  }

  // 2. Check if already verified
  if (user.isVerified) {
    throw new Error("Email is already verified");
  }

  // 3. Generate new verification token
  const verificationToken = crypto.randomBytes(20).toString('hex');
  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpires = Date.now() + 3600000; // 1 hour
  
  await user.save();

  // 4. Send verification email
  await sendVerificationEmail(user.email, verificationToken, user.username);

  res.status(200).json({ 
    success: true,
    message: "Verification email resent successfully"
  });
});

// Admin: Get All Unverified Users --------------------------------------------------------------
const getUnverifiedUsers = asyncHandler(async (req, res) => {
  const users = await getUnverifiedUsersService();

  if (!users || users.length === 0) {
    const error = new Error("No unverified users found");
    error.statusCode = 404; // Not Found
    throw error;
  }

  res.status(200).json(users);
});


// Admin: Delete Unverified Users --------------------------------------------------------------
const deleteUnverifiedUsers = asyncHandler(async (req, res) => {
  const deletedCount = await deleteUnverifiedUsersService();

  if (deletedCount === 0) {
    const error = new Error("No unverified users found");
    error.statusCode = 404; // Not Found
    throw error;
  }

  res.status(200).json({ message: `${deletedCount} unverified users deleted successfully` });
});


// Admin: Delete All Users Except Admins --------------------------------------------------------------
const deleteAllUsersExceptAdmin = asyncHandler(async (req, res) => {
  const deletedCount = await deleteAllUsersExceptAdminService();

  let message;
  if (deletedCount > 0) {
    message = `Successfully deleted ${deletedCount} user(s) except admin.`;
  } else {
    message = "No users other than admin exist. Deleted count: 0.";
  }

  res.status(200).json({
    success: true,
    message: message,
    deletedCount: deletedCount,
  });
});




// Forgot Password --------------------------------------------------------------
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    const error = new Error("Email is required");
    error.statusCode = 400; 
    throw error;
  }

  await forgotPasswordService(email);

  res.status(200).json({ message: "Password reset email sent" });
});




// Validate Reset Token --------------------------------------------------------------
const validateResetToken = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    const error = new Error("Token is required");
    error.statusCode = 400; 
    throw error;
  }

  const userId = await validateResetTokenService(token);

  if (!userId) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 400; 
    throw error;
  }

  res.status(200).json({
    message: "Token is valid. You can now reset your password.",
    userId,
  });
});




// Reset Password --------------------------------------------------------------
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword, confirmNewPassword, userId } = req.body;

  if (!token || !newPassword || !confirmNewPassword || !userId) {
    const error = new Error("All fields are required");
    error.statusCode = 400; 
    throw error;
  }

  // Password match
  confirmPasswordMatch(newPassword, confirmNewPassword);

  await resetPasswordService(userId, token, newPassword);

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});





module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changePassword,
  deleteUser,
  deleteAllUsers,
  deleteSingleUser,
  getAllUsers,
  getSingleUser,
  getAccountInfo,
  updateUserRole,
  resendVerificationEmail,
  getUnverifiedUsers,
  deleteUnverifiedUsers,
  deleteAllUsersExceptAdmin,
  forgotPassword,
  resetPassword,
  validateResetToken,
};
