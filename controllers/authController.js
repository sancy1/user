const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { createProfile } = require("./profileController");
const { generateToken, generateRefreshToken } = require("../middlewares/auth");
require("dotenv").config(); 


const switchGoogleAccountAuthUrl = process.env.SWITCH_GOOGLE_ACCOUNT;

// Wrap passport.authenticate in a function to ensure it exports correctly  --------------------------------------------------------------
const googleAuth = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
};

const googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/login", session: false })(req, res, next);
};

const handleGoogleAuthCallback = async (req, res) => {
  try {
    if (!req.user) {
      const error = new Error("Authentication failed");
      error.statusCode = 401; 
      throw error; 
    }

    console.log("req.user:", req.user);

    const user = req.user;
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    console.log("user._id before profile check:", user._id);

    let profile = await Profile.findOne({ userId: user._id });

    if (!profile) {
      profile = await createProfile(user._id, user.username, user.profileImage);
    }

    if (!profile) {
      const error = new Error("Failed to create or retrieve profile");
      error.statusCode = 500; 
      throw error; 
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      token,
      refreshToken,
      profile: {
        _id: profile._id,
        name: profile.name,
        biography: profile.biography,
        professionalInfo: profile.professionalInfo,
        profileImage: profile.profileImage,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in handleGoogleAuthCallback:", error); 
    throw error; 
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const error = new Error("No refresh token provided");
      error.statusCode = 401; 
      throw error; 
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      const error = new Error("Invalid refresh token");
      error.statusCode = 403; 
      throw error; 
    }

    const newAccessToken = generateToken(user._id, user.role);
    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    console.error("Error in refreshAccessToken:", error); 
    throw error; 
  }
};


// Logout Function --------------------------------------------------------------
const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error); 
    throw error; 
  }
};


// Switch Account Function (if needed) --------------------------------------------------------------
const switchAccount = async (req, res) => {
  try {
    res.redirect(switchGoogleAccountAuthUrl); // Redirect to Google OAuth login
  } catch (error) {
    console.error("Error in switchAccount:", error); 
    throw error; 
  }
};


module.exports = {
  googleAuth,
  googleAuthCallback,
  handleGoogleAuthCallback,
  refreshAccessToken,
  logout,
  switchAccount,
};

































// const passport = require('passport');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Profile = require('../models/Profile');
// const { createProfile } = require('./profileController');
// const { generateToken, generateRefreshToken } = require('../middlewares/auth');
// require('dotenv').config(); // Load environment variables


// const switchGoogleAccountAuhUrl = process.env.SWITCH_GOOGLE_ACCOUNT;

// // Wrap passport.authenticate in a function to ensure it exports correctly
// const googleAuth = (req, res, next) => {
//     passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
// };

// const googleAuthCallback = (req, res, next) => {
//     passport.authenticate('google', { failureRedirect: '/login', session: false })(req, res, next);
// };

// const handleGoogleAuthCallback = async (req, res) => {
//     if (!req.user) {
//         return res.status(401).json({ message: 'Authentication failed' });
//     }

//     console.log('req.user:', req.user);

//     const user = req.user;
//     const token = generateToken(user._id, user.role);
//     const refreshToken = generateRefreshToken(user._id, user.role);

//     console.log('user._id before profile check:', user._id);

//     let profile = await Profile.findOne({ userId: user._id });

//     if (!profile) {
//         profile = await createProfile(user._id, user.username, user.profileImage);
//     }

//     if (profile) {
//         res.status(200).json({
//             _id: user._id,
//             username: user.username,
//             email: user.email,
//             profileImage: user.profileImage,
//             role: user.role,
//             token,
//             refreshToken,
//             profile: {
//                 _id: profile._id,
//                 name: profile.name,
//                 biography: profile.biography,
//                 professionalInfo: profile.professionalInfo,
//                 profileImage: profile.profileImage,
//                 createdAt: profile.createdAt,
//                 updatedAt: profile.updatedAt,
//             },
//         });
//     } else {
//         res.status(500).json({ message: 'Failed to create or retrieve profile' });
//     }
// };

// const refreshAccessToken = async (req, res) => {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//         return res.status(401).json({ message: 'No refresh token provided' });
//     }

//     try {
//         const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//         const user = await User.findById(decoded.userId);

//         if (!user) {
//             return res.status(403).json({ message: 'Invalid refresh token' });
//         }

//         const newAccessToken = generateToken(user._id, user.role);
//         return res.status(200).json({ token: newAccessToken });
//     } catch (error) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
// };

// // Logout Function
// const logout = (req, res) => {
//     res.clearCookie('token');
//     res.clearCookie('refreshToken', {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         path: '/',
//     });
//     res.status(200).json({ message: 'Logged out successfully' });
// };

// // Switch Account Function (if needed)
// const switchAccount = async (req, res) => {
//     res.redirect(switchGoogleAccountAuhUrl); // Redirect to Google OAuth login
// };

// module.exports = {
//     googleAuth,
//     googleAuthCallback,
//     handleGoogleAuthCallback,
//     refreshAccessToken,
//     logout,
//     switchAccount,
// };