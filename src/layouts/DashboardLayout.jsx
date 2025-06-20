  import React from 'react';
  import { Link, Outlet, useNavigate } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext';

  const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const role = user?.role_id;

    const handleLogout = () => {
      logout();             // Clear token & user
      navigate('/');   // Redirect to login
    };
    console.log("Logged-in user context:", role);
    return (
      <div className="flex h-screen bg-gray-100 text-gray-800">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-md p-4 flex flex-col gap-4">
          <div className="text-xl font-bold mb-4">HRMS</div>
          <nav className="flex flex-col gap-2">
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/profile" className="hover:text-blue-600">Profile</Link>
            {/* <Link to="/leaves" className="hover:text-blue-600">Leave Requests</Link> */}
            {/* <Link to="/attendance" className="hover:text-blue-600">Attendance</Link> */}
            <Link to="/payroll" className="hover:text-blue-600">Payroll</Link>
            {/* <Link to="/reviews" className="hover:text-blue-600">Performance</Link> */}
            

            {(role === 2) && (
              <>
              <Link to="/employees" className="hover:text-blue-600">Employees</Link>
              <Link to="/employees/create" className="pl-4 text-sm text-gray-600">➕ Add Employee</Link>
              </>
            )}
            {(role === 1) && (
              <>
              <Link to="/department" className="hover:text-blue-600">Department</Link>
              <Link to="/department/create" className="pl-4 text-sm text-gray-600">➕ Add Department</Link>
              </>
            )}
            {(role === 1) && (
              <>
              <Link to="/gstreceipt" className="hover:text-blue-600">GST Invoice</Link>
              </>
            )}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          
          {/* Header */}
          <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
            <h1 className="text-lg font-semibold">HR Management Dashboard</h1>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
            >
              Logout
            </button>
          </header>

          {/* Page Content */}
          <main className="p-6 overflow-y-auto flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    );
  };

  export default DashboardLayout;
