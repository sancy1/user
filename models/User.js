
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
// const Contact = require("./Contact");
// const Task = require("./Task");
const Profile = require("./Profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// User Schema --------------------------------------------------------------
const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId; 
      },
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
    googleId: { type: String, unique: true, sparse: true },
    profileImage: { type: String },
    profile: { type: String, ref: "Profile" },
  },
  { timestamps: true }
);


// Generate an authentication token --------------------------------------------------------------
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } 
  );
};


// Hash password before saving to database --------------------------------------------------------------
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log("Hashing password before saving to DB...");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});


// Compare entered password with hashed password --------------------------------------------------------------
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Delete related contacts and profile before a user is deleted --------------------------------------------------------------
UserSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
  const userId = this.getFilter()._id; 
  await Profile.deleteOne({ userId: userId });
  // await Contact.deleteMany({ user: userId });
  // await Task.deleteMany({ user: userId }); 
  next();
});


module.exports = mongoose.model("User", UserSchema);
