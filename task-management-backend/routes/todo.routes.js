const express = require('express');
const todoRouter = express.Router();
const { Todo } = require('../models');
const { auth, isHost } = require('../middlewares/Auth');
todoRouter.post('/', auth, async (req, res) => {
  try {
    const todo = new Todo({
      ...req.body,
      userId: req.user._id
    });
    await todo.save();
    res.status(201).send(todo);
  } catch (error) {
    res.status(400).send({
      error: 'Todo Creation Error',
      details: error.message
    });
  }
});

todoRouter.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.send(todos);
  } catch (error) {
    res.status(500).send({
      error: 'Todo Fetch Error',
      details: error.message
    });
  }
});
module.exports = todoRouter;