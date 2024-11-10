taskRouter.get('/my', auth, async (req, res) => {
    try {
      const tasks = await Task.find({ assignedTo: req.user._id })
        .populate('assignedBy', 'username')
        .sort({ createdAt: -1 });
      res.send(tasks);
    } catch (error) {
      res.status(500).send({
        error: 'Task Fetch Error',
        details: error.message
      });
    }
  });