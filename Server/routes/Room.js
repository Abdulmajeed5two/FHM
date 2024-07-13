const express = require('express');
const authMiddleware = require('../middleware/auth');
const Room = require('../models/Room');

const router = express.Router();

// Add a new room
router.post('/add-room', authMiddleware(['admin']), async (req, res) => {
  const { roomNo, type } = req.body;

  // Validate input
  if (!roomNo || !type) {
    return res.status(400).json({ message: 'Room number and type are required.' });
  }

  try {
    const newRoom = new Room({ roomNo, type });
    await newRoom.save();
    res.status(201).json({ message: 'Room added successfully.' });
  } catch (err) {
    console.error("Error adding room:", err);
    res.status(500).json({ message: 'Failed to add room. Please try again later.' });
  }
});

// Get all rooms
router.get('/', authMiddleware(['admin', 'staff']), async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ message: 'Failed to fetch rooms.' });
  }
});

// Other routes (e.g., reserve, check-in, check-out) can be added here...

module.exports = router;
