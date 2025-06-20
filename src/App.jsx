import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import Profile from './pages/Profile';
import Clients from './pages/Clients';
import Department from './pages/Department';
import Leave from './pages/Leaves';
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
        <Route path="leave" element={<Leave />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="profile" element={<Profile />} />
        <Route path="department" element={<Department />} />
        <Route path="clients" element={<Clients />} />
        {/* <Route path="gstreceipt/:invoiceId" element={<GSTReceiptPage />} /> */}
        {/* <Route path="gstreceipt" element={<Navigate to="/gstreceipt/1" replace />} />
        <Route path="gstreceipt/:invoiceId" element={<GSTReceiptPage />} /> */}
        <Route path="gstreceipt" element={<GSTReceiptPage />} />



      </Route>
    </Routes>
  );
}

export default App;
