const mongoose = require('mongoose');
const config = require('./env');
const { addLog } = require('../utils/logStore');

const RETRY_INTERVAL_MS = 5000;

mongoose.set('bufferCommands', false);

let retryTimer = null;

function scheduleRetry() {
  if (retryTimer) return;
  retryTimer = setTimeout(() => {
    retryTimer = null;
    connectDB();
  }, RETRY_INTERVAL_MS);
}

async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    addLog('error', `MongoDB connection failed: ${err.message}`);
    scheduleRetry();
  }
}

mongoose.connection.on('connected', () => {
  addLog('success', 'Database Connected');
});

mongoose.connection.on('error', (err) => {
  addLog('error', `Database Error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  addLog('error', 'MongoDB Connection Lost');
  scheduleRetry();
});

mongoose.connection.on('reconnected', () => {
  addLog('success', 'Database Reconnected');
});

function isConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isConnected };
