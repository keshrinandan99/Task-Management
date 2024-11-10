import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit, Trash2, CheckCircle, Clock, Users, ListTodo } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const initialTasks = [
  { id: 1, title: 'Complete Project', description: 'Finish the MVP', status: 'pending', assignedTo: 'John', dueDate: '2024-11-10' },
  { id: 2, title: 'Review Code', description: 'Code review for frontend', status: 'completed', assignedTo: 'Alice', dueDate: '2024-11-15' },
];

const initialTodos = [
  { id: 1, text: 'Schedule team meeting', completed: false },
  { id: 2, text: 'Review project timeline', completed: true },
];

const HostDashboard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [todos, setTodos] = useState(initialTodos);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [newTodo, setNewTodo] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  });

  useEffect(() => {
    updateTaskStats();
  }, [tasks]);

  const updateTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    setTaskStats({
      total,
      completed,
      pending,
      completionRate
    });
  };

  // Task Management Functions
  const handleAddTask = () => {
    if (newTask.title && newTask.description && newTask.assignedTo && newTask.dueDate) {
      setTasks([
        ...tasks,
        {
          id: tasks.length + 1,
          ...newTask,
          status: 'pending'
        }
      ]);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate
    });
  };

  const handleUpdate = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...newTask }
        : task
    ));
    setEditingTask(null);
    setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
  };

  // Todo Management Functions
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: todos.length + 1,
          text: newTodo,
          completed: false
        }
      ]);
      setNewTodo('');
    }
  };

  const toggleTodo = (todoId) => {
    setTodos(todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (todoId) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
  };

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Task Tracker */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Task Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="p-4 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <h3 className="text-2xl font-bold">{taskStats.total}</h3>
                </div>
                <ListTodo className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <h3 className="text-2xl font-bold">{taskStats.completed}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 bg-yellow-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <h3 className="text-2xl font-bold">{taskStats.pending}</h3>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </Card>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Overall Progress</p>
            <Progress value={taskStats.completionRate} className="h-2" />
            <p className="text-sm text-gray-600 mt-1">{taskStats.completionRate.toFixed(1)}% Complete</p>
          </div>
        </CardContent>
      </Card>

      {/* Task Management Section */}
      <div className="lg:col-span-2">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Task Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <Input
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Assign To"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="mb-2"
              />
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="mb-2"
              />
              <Button
                onClick={editingTask ? handleUpdate : handleAddTask}
                className="w-full"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
            </div>

            <div className="space-y-4">
              {tasks.map(task => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{task.title}</h3>
                      <p className="text-gray-600">{task.description}</p>
                      <p className="text-sm text-gray-500">Assigned to: {task.assignedTo}</p>
                      <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                      <p className="text-sm text-gray-500">Status: {task.status}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(task)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Todo List Section */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Quick Todos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                placeholder="Add a todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              />
              <Button onClick={handleAddTodo}>
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {todos.map(todo => (
                <div key={todo.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="rounded"
                    />
                    <span className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
                      {todo.text}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HostDashboard;