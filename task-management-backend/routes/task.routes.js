const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const taskRouter = express.Router();
const { auth, isHost } = require('../middlewares/Auth');
const { Task } = require('../models');

// Host routes
taskRouter.post('/', auth, isHost, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      assignedBy: req.user._id
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send({
      error: 'Task Creation Error',
      details: error.message
    });
  }
});

taskRouter.get('/all', auth, isHost, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedBy: req.user._id })
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 });
    res.send(tasks);
  } catch (error) {
    res.status(500).send({
      error: 'Task Fetch Error',
      details: error.message
    });
  }
});
module.exports= taskRouter;