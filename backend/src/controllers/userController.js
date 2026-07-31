const userService = require('../services/userService');
const { isConnected } = require('../config/db');

function ensureDbConnected(res) {
  if (!isConnected()) {
    res.status(503).json({
      success: false,
      message: 'MongoDB Connection Lost. Please try again once the database is back online.',
    });
    return false;
  }
  return true;
}

async function getUsers(req, res, next) {
  try {
    if (!ensureDbConnected(res)) return;
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    if (!ensureDbConnected(res)) return;

    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const user = await userService.createUser({ name, email });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    if (!ensureDbConnected(res)) return;

    const { id } = req.params;
    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUsers, createUser, deleteUser };
