const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  roomNo: { type: String, required: true },
});

module.exports = mongoose.model('Inventory', InventorySchema);