import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiHome,
  HiBuildingOffice,
  HiInbox,
  HiCog,
  HiUserGroup,
  HiChartBar
} from 'react-icons/hi';

const Sidebar = () => {
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <HiHome className="h-5 w-5" /> },
    { path: '/admin/floors', label: 'Floor Management', icon: <HiBuildingOffice className="h-5 w-5" /> },
    { path: '/admin/inquiries', label: 'Inquiries', icon: <HiInbox className="h-5 w-5" /> },
    { path: '/admin/users', label: 'Users', icon: <HiUserGroup className="h-5 w-5" /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <HiChartBar className="h-5 w-5" /> },
    { path: '/admin/settings', label: 'Settings', icon: <HiCog className="h-5 w-5" /> }
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-800">
          <div className="text-xl font-bold">
            Tower<span className="text-primary-400">Space</span> Admin
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} TowerSpace
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;