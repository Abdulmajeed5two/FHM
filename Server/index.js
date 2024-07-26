const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const createDefaultAdmin = require('./utils/createDefaultAdmin');

const app = express();

app.use(express.json());
app.use(cors());

connectDB();
createDefaultAdmin();

app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/user', require('./routes/user'));
app.use('/rooms', require('./routes/Room'));

const PORT = 5200;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});