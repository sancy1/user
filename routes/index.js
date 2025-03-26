const express = require("express");
const router = express.Router();

// const contactRoutes = require("./contact");
// const taskRoutes = require("./task");
const userRoutes = require("./userRoutes");
const authRoutes = require('./authRoutes');
const profileRoutes = require("./profileRoutes");


// Use the authRoutes routes
router.use("/users", authRoutes);

// Use the user routes
router.use("/users", userRoutes);

// Use the profile routes
router.use("/users", profileRoutes);

// // Use the task routes
// router.use("/tasks", taskRoutes);

// // Use the contact routes
// router.use("/contacts", contactRoutes);

module.exports = router;