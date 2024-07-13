const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, username, email, gender, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, username, email, gender, password: hashedPassword, role });
  await newUser.save();
  res.status(201).json({ message: 'User registered. Waiting for approval.' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      if (user.isApproved) {
        const token = jwt.sign({ id: user._id, role: user.role }, 'secretKey');
        res.json({ token });
      } else {
        res.status(403).json({ message: 'You are in the waiting list.' });
      }
    } else {
      res.status(403).json({ message: 'Invalid credentials.' });
    }
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
});

module.exports = router;
