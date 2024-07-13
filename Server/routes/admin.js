const express = require('express');
const authMiddleware = require('../middleware/auth');
const Room = require('../models/Room');
const Inventory = require('../models/Inventory');
const User = require('../models/User');

const router = express.Router();

// Add Room
router.post('/add-room', authMiddleware(['admin']), async (req, res) => {
  const { roomNo, type } = req.body;
  const room = new Room({ roomNo, type });
  await room.save();
  res.status(201).json({ message: 'Room added successfully.' });
});

// Get Dashboard Data
router.get('/dashboard', authMiddleware(['admin']), async (req, res) => {
  const totalRooms = await Room.countDocuments();
  const reservedRooms = await Room.countDocuments({ status: 'reserved' });
  const availableRooms = totalRooms - reservedRooms;
  res.json({ totalRooms, reservedRooms, availableRooms });
});

// Reserve Room
router.post('/reserve-room', authMiddleware(['admin', 'staff']), async (req, res) => {
  const { roomId } = req.body;
  const room = await Room.findById(roomId);
  if (room) {
    room.status = 'reserved';
    await room.save();
    res.json({ message: 'Room reserved successfully.' });
  } else {
    res.status(404).json({ message: 'Room not found.' });
  }
});

// Add Inventory
router.post('/add-inventory', authMiddleware(['admin']), async (req, res) => {
  const { roomId, item, quantity } = req.body;
  const inventory = new Inventory({ room: roomId, item, quantity });
  await inventory.save();
  res.json({ message: 'Inventory item added successfully.' });
});

// Get Inventory
router.get('/inventory', authMiddleware(['admin', 'staff']), async (req, res) => {
  const inventory = await Inventory.find().populate('room');
  res.json(inventory);
});

module.exports = router;