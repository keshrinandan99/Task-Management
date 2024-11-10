//import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit, Trash2, CheckCircle, Clock, ListTodo, Calendar } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';


const initialTasks = [
    { id: 1, title: 'Complete Project', description: 'Finish the MVP', status: 'pending', assignedTo: 'John', dueDate: '2024-11-10' },
    { id: 2, title: 'Review Code', description: 'Code review for frontend', status: 'completed', assignedTo: 'Alice', dueDate: '2024-11-15' },
  ];
const initialTodos = [
  { id: 1, text: 'Update daily report', completed: false },
  { id: 2, text: 'Team standup meeting', completed: true },
];

const UserDashboard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const [progressStats, setProgressStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
    todosCompleted: 0
  });

  useEffect(() => {
    updateProgressStats();
  }, [tasks, todos]);

  const updateProgressStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const todosCompleted = todos.filter(todo => todo.completed).length;

    setProgressStats({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      todosCompleted
    });
  };

  const handleStatusChange = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
        : task
    ));
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
      {/* Progress Tracker */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>My Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Card className="p-4 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assigned Tasks</p>
                  <h3 className="text-2xl font-bold">{progressStats.totalTasks}</h3>
                </div>
                <ListTodo className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <h3 className="text-2xl font-bold">{progressStats.completedTasks}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 bg-yellow-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <h3 className="text-2xl font-bold">{progressStats.pendingTasks}</h3>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </Card>
            <Card className="p-4 bg-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Todos Done</p>
                  <h3 className="text-2xl font-bold">{progressStats.todosCompleted}/{todos.length}</h3>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Task Completion Progress</p>
            <Progress value={progressStats.completionRate} className="h-2" />
            <p className="text-sm text-gray-600 mt-1">{progressStats.completionRate.toFixed(1)}% Complete</p>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <div className="lg:col-span-2">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map(task => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                      <p className="text-gray-600">{task.description}</p>
                      <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleStatusChange(task.id)}
                      >
                        <CheckCircle 
                          className={task.status === 'completed' ? 'text-green-500' : 'text-gray-400'} 
                        />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Todos Section */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Personal Todos</CardTitle>
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

export default UserDashboard;