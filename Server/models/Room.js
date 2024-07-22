const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNo: { type: String, unique: true, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'available' },
  cleaningStatus: { type: String, default: 'uncleaned' }, 
  createdAt: { type: Date, default: Date.now },
  reservedBy: { type: String, default: null },
  checkInDate: { type: Date, default: null },
  checkOutDate: { type: Date, default: null },
  amount: { type: Number, default: 0 }, 
  inventoryStatus: { type: String, default: 'good' } 
});

module.exports = mongoose.model('Room', roomSchema);
