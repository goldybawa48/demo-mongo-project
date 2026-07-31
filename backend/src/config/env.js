require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/devops_demo',
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'MongoDB DevOps Demo',
  serverName: process.env.SERVER_NAME || 'api-node-1',
  version: process.env.VERSION || '1.0.0',
  awsRegion: process.env.AWS_REGION || 'ap-south-1',
};

module.exports = config;
