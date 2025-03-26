const fs = require("fs");

const imagePath = "../public/images/logo.png"; // Update path if needed
const base64Image = fs.readFileSync(imagePath, { encoding: "base64" });

console.log(base64Image); // Copy the output and store it in a file
