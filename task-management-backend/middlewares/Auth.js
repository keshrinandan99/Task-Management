// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No authentication token provided');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ 
      error: 'Please authenticate',
      details: error.message 
    });
  }
};

const isHost = (req, res, next) => {
  if (req.user.role !== 'host') {
    return res.status(403).send({ 
      error: 'Access denied',
      details: 'Host privileges required' 
    });
  }
  next();
};

module.exports = { auth, isHost };