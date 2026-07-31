const mongoose = require('mongoose');
const { isConnected } = require('../config/db');
const userService = require('../services/userService');

async function getHealth(req, res) {
  const dbConnected = isConnected();
  let totalUsers = null;

  if (dbConnected) {
    try {
      totalUsers = await userService.countUsers();
    } catch (err) {
      totalUsers = null;
    }
  }

  res.json({
    success: true,
    data: {
      backendStatus: 'connected',
      mongoConnected: dbConnected,
      databaseName: dbConnected ? mongoose.connection.name : null,
      collectionName: 'users',
      serverTime: new Date().toISOString(),
      totalUsers,
      uptimeSeconds: Math.floor(process.uptime()),
    },
  });
}

module.exports = { getHealth };
