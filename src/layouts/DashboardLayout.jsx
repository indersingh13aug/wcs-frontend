import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom'; // ✅ replace Link with NavLink

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role_id;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  console.log("Logged-in user context:", role);

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md p-4 flex flex-col gap-4">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-4">
          <img
            src="/logo.jpg"
            alt="Company Logo"
            className="h-16 w-auto object-contain mb-2 shadow"
          />

        </div>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'
              }`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/payroll"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'
              }`
            }
          >
            Payroll
          </NavLink>
          <NavLink
            to="/leave"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'
              }`
            }
          >
            Leave
          </NavLink>


          {role === 2 && (
            <>
              <NavLink
                to="/employees"
                className={({ isActive }) =>
                  `hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'
                  }`
                }
              >
                Employees
              </NavLink>
              {/* <Link to="/employees" className="hover:text-blue-600">Employees</Link> */}
              {/* <Link to="/employees/create" className="pl-4 text-sm text-gray-600">➕ Add Employee</Link> */}
            </>
          )}

          {role === 1 && (
            <>
              <NavLink
                to="/departments"
                className={({ isActive }) =>
                  `hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'
                  }`
                }
              >
                Departments
              </NavLink>
              <NavLink
                to="/clients"
                className={({ isActive }) =>
                  `hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'
                  }`
                }
              >
                Clients
              </NavLink>
              {/* <Link to="/department" className="hover:text-blue-600">Department</Link> */}
              {/* <Link to="/department/create" className="pl-4 text-sm text-gray-600">➕ Add Department</Link> */}
              {/* <Link to="/gstreceipt" className="hover:text-blue-600">GST Invoice</Link> */}
              <NavLink
                to="/gstreceipt"
                className={({ isActive }) =>
                  `hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'
                  }`
                }
              >
                GST Invoice
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-lg font-semibold">WCA Enterprise Resource Planning</h1>
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
