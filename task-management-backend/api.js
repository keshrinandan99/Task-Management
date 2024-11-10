// api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// Tasks API
export const getTasks = () => api.get('/tasks/all');
export const getMyTasks = () => api.get('/tasks/my');
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.patch(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status });

// Todos API
export const getTodos = () => api.get('/todos');
export const createTodo = (todoData) => api.post('/todos', todoData);
export const updateTodo = (id, todoData) => api.patch(`/todos/${id}`, todoData);
export const deleteTodo = (id) => api.delete(`/todos/${id}`);

// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await api.login(credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      navigate(data.user.role === 'host' ? '/host' : '/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return { user, loading, login, logout };
};

// Example usage in UserDashboard
const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, todosRes] = await Promise.all([
          api.getMyTasks(),
          api.getTodos()
        ]);
        setTasks(tasksRes.data);
        setTodos(todosRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      const { data } = await api.updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(t => t.id === taskId ? data : t));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // ... rest of the component code
};

// Example usage in HostDashboard
const HostDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, todosRes] = await Promise.all([
          api.getTasks(),
          api.getTodos()
        ]);
        setTasks(tasksRes.data);
        setTodos(todosRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTask = async () => {
    try {
      const { data } = await api.createTask(newTask);
      setTasks([...tasks, data]);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // ... rest of the component code
};