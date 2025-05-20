
// scripts/imageCleanup.js
 
const fs = require('fs').promises;
const path = require('path');
const Profile = require('../models/Profile');
const connectDB = require('../config/db/connect');
const logger = require('../utils/logger');

// Config
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
const CHECK_INTERVAL = process.env.NODE_ENV === 'production' ? 3600000 : 60000; // 1h prod / 1m dev
const MIN_FILE_AGE = 3600000; // 1 hour

async function safeDelete(filePath) {
  try {
    const stats = await fs.stat(filePath);
    const fileAge = Date.now() - stats.mtimeMs;
    
    if (fileAge > MIN_FILE_AGE) {
      await fs.unlink(filePath);
      return true;
    }
    return false;
  } catch (error) {
    if (error.code !== 'ENOENT') { // Ignore "file not found" errors
      logger.error(`Deletion error for ${path.basename(filePath)}:`, error);
    }
    return false;
  }
}

async function cleanupOrphanedImages() {
  try {
    logger.info('🚀 Starting image cleanup');
    
    // Verify uploads directory
    try {
      await fs.access(UPLOADS_DIR);
    } catch {
      throw new Error(`Uploads directory missing: ${UPLOADS_DIR}`);
    }

    // Database check
    await connectDB();
    const profileCount = await Profile.countDocuments();
    logger.info(`Connected to DB (${profileCount} profiles)`);

    // Get active images
    const activeImages = new Set(
      (await Profile.find({ profileImage: { $exists: true } }, 'profileImage'))
        .map(p => p.profileImage)
        .filter(img => img?.startsWith('/uploads/'))
    );

    // Process files
    const files = (await fs.readdir(UPLOADS_DIR))
      .filter(file => /^profile-\d+-\d+\.(png|jpg|jpeg|webp)$/i.test(file));

    let deleted = 0;
    for (const file of files) {
      const imagePath = `/uploads/${file}`;
      if (!activeImages.has(imagePath)) {
        const fullPath = path.join(UPLOADS_DIR, file);
        if (await safeDelete(fullPath)) {
          deleted++;
          logger.info(`Deleted orphan: ${file}`);
        }
      }
    }

    logger.info(`✨ Cleanup complete. Deleted ${deleted}/${files.length} files`);
  } catch (error) {
    logger.error('❌ Cleanup failed:', error);
  }
}

// Start with retries
const MAX_RETRIES = 5;
let retries = 0;

async function start() {
  try {
    await cleanupOrphanedImages();
    setInterval(cleanupOrphanedImages, CHECK_INTERVAL);
  } catch (error) {
    if (retries++ < MAX_RETRIES) {
      const delay = Math.min(30000, 2000 * retries);
      logger.warn(`Retry ${retries} in ${delay}ms...`);
      setTimeout(start, delay);
    } else {
      logger.error('Max retries reached. Stopping cleanup service.');
    }
  }
}

// Start service
start();

// Graceful shutdown
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));