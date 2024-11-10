import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPages from './pages/AuthPages';
// import TaskApp from './pages/TaskApp';
import { AuthProvider } from './context/AuthContext';
import UserDashboard from './pages/UserDashboard';
import HostDashboard from './pages/HostDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPages />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/host" element={<HostDashboard />} />
          {/* <Route path="/dashboard" element={<TaskApp />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;