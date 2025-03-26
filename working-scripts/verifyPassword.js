
//  VERIFY PASSWORD----------------------------------------

const bcrypt = require('bcryptjs');

// Replace these values with the actual password and hashed password
const plainPassword = 'password123'; // The password provided during login
const hashedPassword = '$2b$10$Rdk/Gjfb12pjMeZxKWsjXuxQVAMQ2N79ul3flyCr9D8cKdf.0bBoO'; // The hashed password from your database

// Compare the passwords
const verifyPassword = async () => {
  try {
    const passwordMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Password match:', passwordMatch); // true if the passwords match, false otherwise
  } catch (error) {
    console.error('Error verifying password:', error);
  }
};

// Run the script
verifyPassword();









// HASH PASSWORD --------------------------------------------------

// const bcrypt = require('bcryptjs');
// const plainPassword = 'password123'; // The new password
// const saltRounds = 10; // Number of salt rounds

// const hashPassword = async () => {
//   try {
//     const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
//     console.log('Hashed password:', hashedPassword);
//   } catch (error) {
//     console.error('Error hashing password:', error);
//   }
// };

// hashPassword();