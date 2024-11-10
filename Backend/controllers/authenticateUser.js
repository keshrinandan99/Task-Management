const jwt = require('jsonwebtoken');
const authenticateUser = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.replace('Bearer ', '');

    // Verify the token
    console.log("hi")
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("hi")
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (error) {
    console.error('Token validation failed:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
module.exports=authenticateUser;