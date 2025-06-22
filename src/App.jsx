import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import Profile from './pages/Profile';
import Departments from './pages/Departments';
import Clients from './pages/Clients';
import Leaves from './pages/Leaves';
import Project from './pages/Project';
import Role from './pages/Role';
import User from './pages/User';
import GSTReceiptPage from './pages/GSTReceiptPage';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized'; // ❗ You need this

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/" element={<DashboardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="leave" element={<Leaves />} />

        {/* Protected routes */}
        <Route
          path="departments"
          element={
            <ProtectedRoute roles={[1]}>
              <Departments />
            </ProtectedRoute>
          }
        />
        <Route
          path="clients"
          element={
            <ProtectedRoute roles={[1]}>
              <Clients />
            </ProtectedRoute>
          }
        />
        <Route
          path="role"
          element={
            <ProtectedRoute roles={[1]}>
              <Role />
            </ProtectedRoute>
          }
        />
        <Route
          path="project"
          element={
            <ProtectedRoute roles={[1]}>
              <Project />
            </ProtectedRoute>
          }
        />
        <Route
          path="user"
          element={
            <ProtectedRoute roles={[1]}>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="employees"
          element={
            <ProtectedRoute roles={[2]}>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="gstreceipt"
          element={
            <ProtectedRoute roles={[1]}>
              <GSTReceiptPage />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized route */}
        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  );
}

export default App;
