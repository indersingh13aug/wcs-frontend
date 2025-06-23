import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import Profile from './pages/Profile';
import Departments from './master/Departments';
import Clients from './pages/Clients';
import Leaves from './pages/Leaves';
import Project from './master/Project';
import Role from './master/Role';
import User from './master/User';
import GSTInvoicePage from './pages/GSTInvoicePage';
import Unauthorized from './pages/Unauthorized'; // ❗️ Add this page
import ProtectedRoute from './components/ProtectedRoute';
import GSTItems from './pages/GSTItems';
function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Login />} />

      {/* Protected Layout + Nested Routes */}
      <Route path="/" element={<DashboardLayout />}>
        {/* Publicly visible to all logged-in users */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="payroll"
          element={
            <ProtectedRoute>
              <Payroll />
            </ProtectedRoute>
          }
        />
        <Route
          path="leave"
          element={
            <ProtectedRoute>
              <Leaves />
            </ProtectedRoute>
          }
        />

        {/* Role-based protected routes */}
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
          path="gstinvoice"
          element={
            <ProtectedRoute roles={[1]}>
              <GSTInvoicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="gstitems"
          element={
            <ProtectedRoute roles={[1]}>
              <GSTItems />
            </ProtectedRoute>
          }
        />

        {/* Employees accessible to role_id 2 */}
        <Route
          path="employees"
          element={
            <ProtectedRoute roles={[2]}>
              <Employees />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized page */}
        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  );
}

export default App;
