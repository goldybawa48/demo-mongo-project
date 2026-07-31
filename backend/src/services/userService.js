const User = require('../models/User');

async function getAllUsers() {
  return User.find().sort({ createdAt: -1 });
}

async function createUser({ name, email }) {
  const user = new User({ name, email });
  return user.save();
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}

async function countUsers() {
  return User.countDocuments();
}

module.exports = { getAllUsers, createUser, deleteUser, countUsers };
