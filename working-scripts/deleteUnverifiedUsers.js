require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path to your User model

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Delete unverified users
const deleteUnverifiedUsers = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Delete users where isVerified is false
    const result = await User.deleteMany({ isVerified: false });

    console.log(`Deleted ${result.deletedCount} unverified users.`);

    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('Error deleting unverified users:', error);
    process.exit(1);
  }
};

// Run the script
deleteUnverifiedUsers();