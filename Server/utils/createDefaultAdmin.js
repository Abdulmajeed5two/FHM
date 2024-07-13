const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createDefaultAdmin = async () => {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin', 10);
    await User.create({
      name: 'Abdulmajeed',
      username: 'abdulmajeed',
      email: 'abdulmajeed.5two@gmail.com',
      gender: 'male',
      password: hashedPassword,
      role: 'admin',
      isApproved: true,
    });
    console.log('Default admin created');
  }
};

module.exports = createDefaultAdmin;
