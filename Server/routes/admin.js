const express = require('express');
const authMiddleware = require('../middleware/auth');
const Room = require('../models/Room');
const User = require('../models/User');

const router = express.Router();


router.post('/add-room', authMiddleware(['admin']), async (req, res) => {
  const { roomNo, type } = req.body;
  const room = new Room({ roomNo, type });
  await room.save();
  res.status(201).json({ message: 'Room added successfully.' });
});


router.get('/dashboard', authMiddleware(['admin']), async (req, res) => {
  const totalRooms = await Room.countDocuments();
  const reservedRooms = await Room.countDocuments({ status: 'reserved' });
  const availableRooms = totalRooms - reservedRooms;
  res.json({ totalRooms, reservedRooms, availableRooms });
});


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



module.exports = router;