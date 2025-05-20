
// ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'api-server',
      script: 'server.js'
    },
    {
      name: 'image-cleanup',
      script: 'scripts/imageCleanup.js',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    }
  ]
};

// To start your production application (both server and cleanup script) using PM2, you'll run:
// pm2 start ecosystem.config.js