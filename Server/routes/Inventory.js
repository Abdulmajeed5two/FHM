const express = require('express');
const authMiddleware = require('../middleware/auth');
const Inventory = require('../models/Inventory');

const router = express.Router();

router.post('/add-item', authMiddleware(['admin']), async (req, res) => {
  const { itemName, quantity, roomId } = req.body;
  const newItem = new Inventory({ itemName, quantity, roomId });
  await newItem.save();
  res.status(201).json({ message: 'Item added to inventory successfully.' });
});

router.get('/', authMiddleware(['admin', 'staff']), async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
});

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
