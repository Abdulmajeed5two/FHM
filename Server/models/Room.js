const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNo: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['available', 'reserved'], default: 'available' },
  createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Room', RoomSchema);