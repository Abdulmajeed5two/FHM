const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/auth-system', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  gender: String,
  password: String,
  role: { type: String, enum: ['admin', 'receptionist', 'cleaner', 'plumber', 'staff'], default: 'staff' },
  isApproved: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

const createDefaultAdmin = async () => {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      gender: 'male',
      password: hashedPassword,
      role: 'admin',
      isApproved: true,
    });
    console.log('Default admin created');
  }
};

createDefaultAdmin();

app.post('/register', async (req, res) => {
  const { name, username, email, gender, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, username, email, gender, password: hashedPassword, role });
  await newUser.save();
  res.status(201).json({ message: 'User registered. Waiting for approval.' });
});

app.post('/approve', async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    user.isApproved = true;
    await user.save();
    res.json({ message: 'User approved.' });
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
});

app.post('/set-pending', async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    user.isApproved = false;
    await user.save();
    res.json({ message: 'User set to pending.' });
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
});

app.delete('/delete-user', async (req, res) => {
  const { username } = req.body;
  const user = await User.findOneAndDelete({ username });
  if (user) {
    res.json({ message: 'User deleted.' });
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
});

app.get('/unapproved-users', async (req, res) => {
  const users = await User.find({ isApproved: false });
  res.json(users);
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

app.post('/login', async (req, res) => {
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

const authMiddleware = (roles) => (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided.' });

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token.' });

    if (!roles.includes(decoded.role)) return res.status(403).json({ message: 'Unauthorized.' });

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};


app.get('/admin', authMiddleware(['admin']), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

app.get('/user', authMiddleware(['user', 'admin', 'receptionist', 'cleaner', 'plumber', 'staff']), (req, res) => {
  res.json({ message: `Welcome, ${req.userRole}!` });
});
app.get('/staff', async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ['receptionist', 'cleaner', 'plumber', 'staff'] } });
    res.json(staff);
  } catch (err) {
    console.error("Error fetching staff:", err);
    res.status(500).json({ message: 'Failed to fetch staff' });
  }
});


app.listen(5200, () => {
  console.log('Server running on port 5200');
});
