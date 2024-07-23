const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, username, email, gender, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      email,
      gender,
      password: hashedPassword,
      role,
      status: 'pending', // default status
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered. Waiting for approval.' });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: 'Failed to register user.' });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'Invalid credentials.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Your account is not approved yet.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'secretKey');
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Failed to log in.' });
  }
});

module.exports = router;
