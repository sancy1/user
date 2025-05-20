
// In services/fileStorage.js
const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const uploadToS3 = async (file) => {
  const fileStream = fs.createReadStream(file.path);
  
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fileStream,
    Key: `profile-images/${Date.now()}-${file.originalname}`
  };

  return s3.upload(uploadParams).promise();
};

module.exports = { uploadToS3 };