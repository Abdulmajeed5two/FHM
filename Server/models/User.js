const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  gender: String,
  password: String,
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  status: { type: String, enum: ['active', 'pending'], default: 'pending' },
});

module.exports = mongoose.model('User', userSchema);
