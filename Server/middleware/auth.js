const jwt = require('jsonwebtoken');

const authMiddleware = (roles) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error('No authorization header provided.');
    return res.status(403).json({ message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('No token found in authorization header.');
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      console.error('Failed to authenticate token:', err);
      return res.status(500).json({ message: 'Failed to authenticate token.' });
    }

    if (!roles.includes(decoded.role)) {
      console.error('User role unauthorized:', decoded.role);
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

module.exports = authMiddleware;
