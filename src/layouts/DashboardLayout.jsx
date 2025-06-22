import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.employee?.role_id;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [openMenus, setOpenMenus] = useState({
    admin: false,
    leave: false,
    payroll: false,
    gst: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuLink = (to, label) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block pl-6 py-1 text-sm hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'}`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md p-4 flex flex-col gap-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.jpg" alt="Company Logo" className="h-16 w-auto object-contain mb-2 shadow" />
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'}`
            }
          >
            Dashboard
          </NavLink>

          {/* Admin (role 1) */}
          {role === 1 && (
            <div>
              <button onClick={() => toggleMenu('admin')} className="w-full text-left font-medium hover:text-blue-600">
                Admin
              </button>
              {openMenus.admin && (
                <div className="ml-2 flex flex-col">
                  {menuLink('/departments', 'Department')}
                  {menuLink('/clients', 'Client')}
                  {menuLink('/role', 'Role')}
                  {menuLink('/project', 'Project')}
                  {menuLink('/user', 'User')}
                  {menuLink('/leave', 'Leave')}
                  {menuLink('/gstitems', 'GST Items')}
                </div>
              )}
            </div>
          )}

          {/* Leave */}
          <div>
            <button onClick={() => toggleMenu('leave')} className="w-full text-left font-medium hover:text-blue-600">
              Leave
            </button>
            {openMenus.leave && (
              <div className="ml-2 flex flex-col">
                {menuLink('/leave/apply', 'Apply Leave')}
                {menuLink('/leave/balance', 'Leave Balance')}
              </div>
            )}
          </div>

          {/* Employees (role 2) */}
          {role === 2 && (
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'}`
              }
            >
              Employee
            </NavLink>
          )}

          {/* Payroll */}
          <div>
            <button onClick={() => toggleMenu('payroll')} className="w-full text-left font-medium hover:text-blue-600">
              Payroll
            </button>
            {openMenus.payroll && (
              <div className="ml-2 flex flex-col">
                {menuLink('/payroll/salary', 'Salary')}
              </div>
            )}
          </div>

          {/* GST */}
          <div>
            <button onClick={() => toggleMenu('gst')} className="w-full text-left font-medium hover:text-blue-600">
              GST
            </button>
            {openMenus.gst && (
              <div className="ml-2 flex flex-col">
                {menuLink('/gstinvoice', 'GST Invoice')}
              </div>
            )}
          </div>

          {/* Profile */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'}`
            }
          >
            Profile
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-lg font-semibold">WCA Enterprise Resource Planning</h1>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
          >
            Logout
          </button>
        </header>

        <main className="p-6 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
