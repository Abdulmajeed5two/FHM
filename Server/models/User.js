const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  gender: String,
  password: String,
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  isApproved: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);