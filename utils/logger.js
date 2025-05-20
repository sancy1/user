
// utils/logger.js

// const { createLogger, format, transports } = require('winston');

// module.exports = createLogger({
//   level: 'info',
//   format: format.combine(
//     format.timestamp(),
//     format.printf(({ level, message, timestamp }) => {
//       return `${timestamp} [${level.toUpperCase()}]: ${message}`;
//     })
//   ),
//   transports: [
//     new transports.Console(),
//     new transports.File({ filename: 'logs/image-cleanup.log' })
//   ]
// });





// utils/logger.js

const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Keep this for Render to collect logs
    // new transports.File({ filename: 'logs/image-cleanup.log' }) // Comment out or remove for Render deployment
  ]
});