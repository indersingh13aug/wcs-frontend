import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/attendance', label: 'Attendance' },
    { path: '/leaves', label: 'Leaves' },
    { path: '/payroll', label: 'Payroll' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/profile', label: 'Profile' },
  ];

  if (user?.role === 'hr' || user?.role === 'admin') {
    navItems.push({ path: '/employees', label: 'Employees' });
  }
  console.log("Navbar User:", user);

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="font-bold text-xl">HRMS</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600'
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="ml-4 text-red-500 hover:underline"
          >
            Logout
          </button>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-700">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? 'block text-blue-600 font-semibold'
                  : 'block text-gray-700 hover:text-blue-600'
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="block text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
