
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


// Profile Schema --------------------------------------------------------------
const ProfileSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    userId: { type: String, required: true, unique: true }, 
    name: { type: String },
    address: { type: String },
    biography: { type: String },
    professionalInfo: { type: String },
    profileImage: { type: String }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Profile', ProfileSchema);