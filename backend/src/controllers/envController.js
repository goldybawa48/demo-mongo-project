const config = require('../config/env');
const sanitizeMongoUri = require('../utils/sanitizeMongoUri');

function getEnv(req, res) {
  res.json({
    success: true,
    data: {
      APP_NAME: config.appName,
      NODE_ENV: config.nodeEnv,
      PORT: config.port,
      MONGO_URI: sanitizeMongoUri(config.mongoUri),
      VERSION: config.version,
      SERVER_NAME: config.serverName,
      AWS_REGION: config.awsRegion,
    },
  });
}

module.exports = { getEnv };
