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
import GSTReceiptPage from './pages/GSTReceiptPage';
import { Navigate } from 'react-router-dom';


function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Login />} />

      {/* Protected routes inside dashboard layout */}
      <Route path="/" element={<DashboardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="leave" element={<Leaves />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="profile" element={<Profile />} />
        <Route path="departments" element={<Departments />} />
        <Route path="clients" element={<Clients />} />
        <Route path="project" element={<Project />} />
        <Route path="role" element={<Role />} />
        {/* <Route path="gstreceipt/:invoiceId" element={<GSTReceiptPage />} /> */}
        {/* <Route path="gstreceipt" element={<Navigate to="/gstreceipt/1" replace />} />
        <Route path="gstreceipt/:invoiceId" element={<GSTReceiptPage />} /> */}
        <Route path="gstreceipt" element={<GSTReceiptPage />} />



      </Route>
    </Routes>
  );
}

export default App;
