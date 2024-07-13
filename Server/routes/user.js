const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get the profile of the logged-in user
router.get('/profile', authMiddleware(['admin', 'receptionist', 'staff']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ username: user.username, email: user.email, role: user.role }); // Return username, email, and role
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
});

// Get all users (for staff)
router.get('/', authMiddleware(['admin', 'staff']), async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// Get user details by ID (for staff)
router.get('/:id', authMiddleware(['admin', 'staff']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: 'Failed to fetch user details.' });
  }
});

// Update user details (for admin or staff)
router.put('/:id', authMiddleware(['admin', 'staff']), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: 'Failed to update user.' });
  }
});

// Delete user (for admin)
router.delete('/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
});

module.exports = router;
