const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Todo = require('../models/Todo');
const authenticateUser = require('../controllers/authenticateUser');  // Import the authentication middleware

// Get all tasks for the authenticated user
router.get('/tasks', authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a task for the authenticated user
router.post('/tasks', authenticateUser, async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    assignedTo: req.user.id,
    dueDate: req.body.dueDate
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task for the authenticated user
router.put('/tasks/:id', authenticateUser, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.assignedTo.toString() !== req.user.id.toString()) {
      return res.status(404).json({ message: 'Task not found' });
    }

    Object.assign(task, req.body);  // Update task with new data
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task for the authenticated user
router.delete('/tasks/:id', authenticateUser, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.assignedTo.toString() !== req.user.id.toString()) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all todos for the authenticated user
router.get('/todos', authenticateUser, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a todo for the authenticated user
router.post('/todos', authenticateUser, async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    user: req.user.id
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a todo for the authenticated user
router.put('/todos/:id', authenticateUser, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo || todo.user.toString() !== req.user.id.toString()) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.completed = !todo.completed;  // Toggle completion status
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a todo for the authenticated user
router.delete('/todos/:id', authenticateUser, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo || todo.user.toString() !== req.user.id.toString()) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await todo.remove();
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
