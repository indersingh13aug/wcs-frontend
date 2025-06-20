import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, CalendarCheck, FileText, Users,
  Briefcase, Star, UserCircle
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { to: '/attendance', label: 'Attendance', icon: <CalendarCheck size={18} /> },
    { to: '/leaves', label: 'Leaves', icon: <FileText size={18} /> },
    { to: '/payroll', label: 'Payroll', icon: <Briefcase size={18} /> },
    { to: '/reviews', label: 'Reviews', icon: <Star size={18} /> },
    { to: '/profile', label: 'Profile', icon: <UserCircle size={18} /> },
  ];

  if (user?.role === 'hr' || user?.role === 'admin') {
    navItems.push({ to: '/employees', label: 'Employees', icon: <Users size={18} /> });
  }

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 p-4 hidden md:block">
      <div className="flex items-center gap-2 mb-8">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        <h1 className="text-xl font-bold text-gray-800">HRMS</h1>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                isActive
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
