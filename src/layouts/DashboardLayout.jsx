import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout, accessiblePages } = useAuth();
  const navigate = useNavigate();

  const [openGroups, setOpenGroups] = useState({});

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleGroup = (group) => {
    const hasSubmenu = groupedPages[group]?.length > 0;
    
    setOpenGroups((prev) => {
      // Collapse all groups first
      const newState = {};
      if (hasSubmenu) {
        newState[group] = !prev[group]; // toggle only if it has submenu
      }
      return newState;
    });
  };



  // 🔸 Group pages by 'group'
  const groupedPages = accessiblePages.reduce((acc, page) => {
    const group = page.group_name?.trim() || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(page);
    return acc;
  }, {});
  console.log("Grouped Pages:", groupedPages);
  
  const menuLink = (to, label) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `block pl-6 py-1 text-sm hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md p-4 flex flex-col gap-4">
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.jpg" alt="Logo" className="h-16 w-auto mb-2 shadow" />
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          {/* Always show dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800'}`
            }
          >
            Dashboard
          </NavLink>

          {/* Dynamically render grouped menus */}
          {Object.keys(groupedPages).map((group) => (
            <div key={group}>
              <button
                onClick={() => toggleGroup(group)}
                className="w-full text-left font-medium hover:text-blue-600"
              >
                {group}
              </button>

              {/* Only render submenu if items exist */}
              {openGroups[group] && groupedPages[group]?.length > 0 && (
                <div className="ml-2 flex flex-col">
                  {groupedPages[group].map((page) => menuLink(page.path, page.name))}
                </div>
              )}
            </div>
          ))}

        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-lg font-semibold">Enterprise Resource Planning</h1>
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
