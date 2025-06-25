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
import Unauthorized from './pages/Unauthorized'; 
import ProtectedRoute from './components/ProtectedRoute';
import GSTItems from './master/GSTItems';
import PageManager from './master/PageManager'
import RolePageAccess from './pages/RolePageAccess'
import Services from './master/Services'
import Sales from './pages/Sales'
import RoleUserMap from './pages/RoleUserMap'
import LeaveTypes from './master/LeaveTypes';
import Tasks from './master/Tasks';
import TaskAssign from './pages/TaskAssign';
import LeaveWorklist from './pages/leave/LeaveWorklist';
import ProjectEmployeeMap from './pages/ProjectEmployeeMap';
import ProjectDetails from './pages/ProjectDetails';

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
      <Route
          path="leavetypes"
          element={
            <ProtectedRoute>
              <LeaveTypes />
            </ProtectedRoute>
          }
        />
        <Route path="tasklist" element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route path="taskassign" element={
            <ProtectedRoute>
              <TaskAssign />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="leaveworklist"
          element={
            <ProtectedRoute>
              <LeaveWorklist />
            </ProtectedRoute>
          }
        />
        {/* Role-based protected routes */}
        <Route
          path="departments"
          element={
            <ProtectedRoute>
              <Departments />
            </ProtectedRoute>
          }
        />
        <Route
          path="projectemployeemap"
          element={
            <ProtectedRoute>
              <ProjectEmployeeMap />
            </ProtectedRoute>
          }
        />
         <Route
          path="projectdetails"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
        
        
        <Route
          path="roleusermap"
          element={
            <ProtectedRoute>
              <RoleUserMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="clients"
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute>
              <Role />
            </ProtectedRoute>
          }
        />
        <Route
          path="pagemanager"
          element={
            <ProtectedRoute>
              <PageManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="rolepageaccess"
          element={
            <ProtectedRoute>
              <RolePageAccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects"
          element={
            <ProtectedRoute>
              <Project />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="gst-invoices"
          element={
            <ProtectedRoute>
              <GSTInvoicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="gst-items"
          element={
            <ProtectedRoute>
              <GSTItems />
            </ProtectedRoute>
          }
        />

        {/* Employees accessible to role_id 2 */}
        <Route
          path="employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />

        <Route
          path="sales"
          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          }
        />
         <Route
          path="services"
          element={
            <ProtectedRoute>
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
