import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import {
  HiHome,
  HiOfficeBuilding,
  HiInbox,
  HiCog,
  HiLogout,
  HiMenu,
  HiX,
  HiChevronDown,
  HiSun,
  HiMoon
} from 'react-icons/hi';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <HiHome className="h-5 w-5" /> },
    { path: '/admin/floors', label: 'Floor Management', icon: <HiOfficeBuilding className="h-5 w-5" /> },
    { path: '/admin/inquiries', label: 'Inquiries', icon: <HiInbox className="h-5 w-5" /> },
    { path: '/admin/settings', label: 'Settings', icon: <HiCog className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-all duration-300 ease-in-out bg-gray-900 border-r border-gray-800 shadow-2xl md:shadow-none`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 h-20 px-6 border-b border-gray-800">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <HiOfficeBuilding className="h-6 w-6 text-white" />
            </div>
            <div className="text-xl font-black tracking-tight text-white">
              Tower<span className="text-primary-400">Space</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
            <div className="px-4 mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Main Menu</p>
            </div>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 group ${isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 translate-x-1'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`transition-transform duration-200 group-hover:scale-110`}>
                  {item.icon}
                </div>
                <span className="ml-4 font-semibold text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User info */}
          <div className="p-6 border-t border-gray-800 bg-gray-900/50">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-white">{user?.username || 'Admin User'}</p>
                <p className="text-[10px] font-medium text-gray-500 truncate uppercase tracking-wider">{user?.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-72 flex flex-col min-h-screen">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            {/* Left: Mobile menu button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
              </button>
              <h2 className="hidden sm:block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
                Control Panel
              </h2>
            </div>

            {/* Right: User menu & Theme Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
                aria-label="Toggle theme"
              >
                {isDark ? <HiSun className="h-5 w-5 text-yellow-500" /> : <HiMoon className="h-5 w-5" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 pl-3 pr-2 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all shadow-sm active:scale-95"
                >
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user?.role || 'Admin'}</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{user?.username}</div>
                  </div>
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-100 to-cyan-100 dark:from-primary-900 dark:to-cyan-900 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold border border-primary-200 dark:border-primary-800 shadow-inner">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <HiChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setUserDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-40 overflow-hidden"
                      >
                        <div className="px-4 py-3 mb-2 border-b border-gray-50 dark:border-gray-700 md:hidden">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-red-100/50 dark:bg-red-900/50 mr-3">
                            <HiLogout className="h-5 w-5" />
                          </div>
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;