import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import Profile from './pages/Profile';
import Departments from './master/Departments';
import Clients from './master/Clients';
import LeaveRequests from './pages/leave/LeaveRequests';
import Project from './master/Project';
import Role from './master/Role';
import User from './master/User';
import GSTInvoicePage from './pages/GSTInvoicePage';
import Unauthorized from './pages/Unauthorized'; // ❗️ Add this page
import ProtectedRoute from './components/ProtectedRoute';
import GSTItems from './master/GSTItems';
import PageManager from './pages/PageManager'
import RolePageAccess from './pages/RolePageAccess'
import Services from './master/Services'
import Sales from './pages/Sales'



function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

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
          path="leave-request"
          element={
            <ProtectedRoute>
              <LeaveRequests />
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
          path="roles"
          element={
            <ProtectedRoute roles={[1]}>
              <Role />
            </ProtectedRoute>
          }
        />
        <Route
          path="pagemanager"
          element={
            <ProtectedRoute roles={[1]}>
              <PageManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="rolepageaccess"
          element={
            <ProtectedRoute roles={[1]}>
              <RolePageAccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects"
          element={
            <ProtectedRoute roles={[1]}>
              <Project />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute roles={[1]}>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="gst-invoices"
          element={
            <ProtectedRoute roles={[1]}>
              <GSTInvoicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="gst-items"
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

        <Route
          path="sales"
          element={
            <ProtectedRoute roles={[1]}>
              <Sales />
            </ProtectedRoute>
          }
        />
         <Route
          path="services"
          element={
            <ProtectedRoute roles={[1]}>
              <Services />
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
