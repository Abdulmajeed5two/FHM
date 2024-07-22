const express = require('express');
const authMiddleware = require('../middleware/auth');
const Room = require('../models/Room');

const router = express.Router();

router.post('/add-room', authMiddleware(['admin']), async (req, res) => {
  const { roomNo, type, amount, inventoryStatus } = req.body;

  if (!roomNo || !type) {
    return res.status(400).json({ message: 'Room number and type are required.' });
  }

  try {
    const roomNoWithPrefix = `R-${roomNo}`;
    const existingRoom = await Room.findOne({ roomNo: roomNoWithPrefix });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists.' });
    }
    
    const newRoom = new Room({ 
      roomNo: roomNoWithPrefix, 
      type, 
      amount: amount || 0, 
      inventoryStatus: inventoryStatus || 'good' 
    });
    await newRoom.save();
    res.status(201).json({ message: 'Room added successfully.' });
  } catch (err) {
    console.error("Error adding room:", err);
    res.status(500).json({ message: 'Failed to add room. Please try again later.' });
  }
});


router.post('/reserve-room', authMiddleware(['admin', 'staff']), async (req, res) => {
  const { roomNo, userName, checkInDate, checkOutDate, amount } = req.body;

  if (!roomNo || !userName || !checkInDate || !checkOutDate) {
    return res.status(400).json({ message: 'Room number, user name, check-in date, and check-out date are required.' });
  }

  try {
    const room = await Room.findOne({ roomNo });

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    if (room.status === 'reserved') {
      return res.status(400).json({ message: 'Room is already reserved.' });
    }

    if (room.cleaningStatus !== 'cleaned' || room.inventoryStatus !== 'good') {
      return res.status(400).json({ message: 'Room is not available due to maintenance or inventory issues.' });
    }

    room.status = 'reserved';
    room.reservedBy = userName;
    room.checkInDate = new Date(checkInDate);
    room.checkOutDate = new Date(checkOutDate);
    room.amount = amount;

    await room.save();

    res.status(200).json({ message: 'Room reserved successfully.' });
  } catch (err) {
    console.error("Error reserving room:", err);
    res.status(500).json({ message: 'Failed to reserve room. Please try again later.' });
  }
});


router.post('/checkout-room', authMiddleware(['admin', 'staff']), async (req, res) => {
  const { roomNo } = req.body;

  if (!roomNo) {
    return res.status(400).json({ message: 'Room number is required.' });
  }

  try {
    const room = await Room.findOne({ roomNo });

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    if (room.status !== 'reserved') {
      return res.status(400).json({ message: 'Room is not reserved.' });
    }

    room.status = 'available';
    room.reservedBy = null;
    room.checkInDate = null;
    room.checkOutDate = null;
    room.amount = null;
    room.cleaningStatus = 'uncleaned'; 

    await room.save();

    res.status(200).json({ message: 'Room checked out successfully.' });
  } catch (err) {
    console.error("Error checking out room:", err);
    res.status(500).json({ message: 'Failed to check out room. Please try again later.' });
  }
});

// Delete a room
router.delete('/:roomNo', authMiddleware(['admin']), async (req, res) => {
  const { roomNo } = req.params;

  if (!roomNo) {
    return res.status(400).json({ message: 'Room number is required.' });
  }

  try {
    const room = await Room.findOneAndDelete({ roomNo });

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    res.status(200).json({ message: 'Room deleted successfully.' });
  } catch (err) {
    console.error("Error deleting room:", err);
    res.status(500).json({ message: 'Failed to delete room. Please try again later.' });
  }
});


router.get('/', authMiddleware(['admin', 'staff']), async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ message: 'Failed to fetch rooms.' });
  }
});


router.get('/reserved', authMiddleware(['admin', 'staff']), async (req, res) => {
  try {
    const reservedRooms = await Room.find({ status: 'reserved' });
    res.json(reservedRooms);
  } catch (err) {
    console.error("Error fetching reserved rooms:", err);
    res.status(500).json({ message: 'Failed to fetch reserved rooms.' });
  }
});


router.get('/total-amount', authMiddleware(['admin', 'staff']), async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'reserved' });
    const totalAmount = rooms.reduce((acc, room) => acc + (room.amount || 0), 0);
    res.json({ value: totalAmount });
  } catch (err) {
    console.error("Error fetching total amount:", err);
    res.status(500).json({ message: 'Failed to fetch total amount.' });
  }
});


router.get('/total-rooms', authMiddleware(['admin', 'staff']), async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    res.json({ value: totalRooms });
  } catch (err) {
    console.error("Error fetching total rooms:", err);
    res.status(500).json({ message: 'Failed to fetch total rooms.' });
  }
});


router.get('/reserved-rooms', authMiddleware(['admin', 'staff']), async (req, res) => {
  try {
    const reservedRooms = await Room.countDocuments({ status: 'reserved' });
    res.json({ value: reservedRooms });
  } catch (err) {
    console.error("Error fetching reserved rooms:", err);
    res.status(500).json({ message: 'Failed to fetch reserved rooms.' });
  }
});


router.get('/available-rooms', authMiddleware(['admin', 'staff']), async (req, res) => {
  try {
    const availableRooms = await Room.countDocuments({ status: 'available', cleaningStatus: 'cleaned', inventoryStatus: 'good' });
    res.json({ value: availableRooms });
  } catch (err) {
    console.error("Error fetching available rooms:", err);
    res.status(500).json({ message: 'Failed to fetch available rooms.' });
  }
});


router.post('/update-cleaning-status', authMiddleware(['admin', 'staff']), async (req, res) => {
  const { roomNo, cleaningStatus } = req.body;

  if (!roomNo || !cleaningStatus) {
    return res.status(400).json({ message: 'Room number and cleaning status are required.' });
  }

  try {
    const room = await Room.findOne({ roomNo });

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    room.cleaningStatus = cleaningStatus;

    await room.save();

    res.status(200).json({ message: `Room cleaning status updated to ${cleaningStatus}.` });
  } catch (err) {
    console.error("Error updating cleaning status:", err);
    res.status(500).json({ message: 'Failed to update cleaning status. Please try again later.' });
  }
});

module.exports = router;
