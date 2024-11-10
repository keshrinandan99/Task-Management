//const { auth, isHost } = require('../middlewares/Auth');
//routes/auth.routes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
// middleware/auth.js
//const jwt = require('jsonwebtoken');
//const { User } = require('../models');




router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    const user = new User({ username, email, password, role });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
    
    res.status(201).send({ 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }, 
      token 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({
        error: 'Validation Error',
        details: 'Username or email already exists'
      });
    }
    res.status(400).send({
      error: 'Registration Error',
      details: error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid login credentials');
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid login credentials');
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
    
    res.send({ 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }, 
      token 
    });
  } catch (error) {
    res.status(400).send({
      error: 'Login Error',
      details: error.message
    });
  }
});
module.exports = router;