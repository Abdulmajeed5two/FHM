const express = require('express');
const authMiddleware = require('../middleware/auth');
const Inventory = require('../models/Inventory');

const router = express.Router();

// Add an inventory item
router.post('/add-item', authMiddleware(['admin']), async (req, res) => {
  const { itemName, quantity, roomNo } = req.body;
  const newItem = new Inventory({ itemName, quantity, roomNo });
  await newItem.save();
  res.status(201).json({ message: 'Item added to inventory successfully.' });
});

// Get all inventory items
router.get('/', authMiddleware(['admin', 'staff']), async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
});

// Update inventory item
router.put('/update-item/:id', authMiddleware(['admin']), async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const item = await Inventory.findByIdAndUpdate(id, { quantity }, { new: true });
  if (item) {
    res.json({ message: 'Inventory item updated successfully.', item });
  } else {
    res.status(404).json({ message: 'Item not found.' });
  }
});

module.exports = router;
