const jwt = require('jsonwebtoken');

const authMiddleware = (roles) => (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
  if (!token) return res.status(403).json({ message: 'No token provided.' });

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token.' });
    if (!roles.includes(decoded.role)) return res.status(403).json({ message: 'Unauthorized.' });

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

module.exports = authMiddleware;