
// // config/db/connect.js

// /**
//  * Database Connection
//  * Establishing a connection to MongoDB using Mongoose.
//  */

// const mongoose = require("mongoose");
// require("dotenv").config();

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("MongoDB Connection Error:", error.message);
//     process.exit(1); // Stop the server if DB connection fails
//   }
// };

// module.exports = connectDB;






// config/db/connect.js

/**
 * Database Connection
 * Establishing a connection to MongoDB using Mongoose.
 */

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI); // Removed deprecated options
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

module.exports = connectDB;
