import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HiBars3, 
  HiXMark, 
  HiChevronDown, 
  HiBuildingOffice,
  HiPhone,
  HiCalendar,
  HiMapPin
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // FIXED: Removed /virtual-tour route that doesn't exist
  const navItems = [
    { path: '/', label: 'Home', icon: HiBuildingOffice },
    { path: '/floors', label: 'Floor Plans', icon: HiMapPin },
    { path: '/amenities', label: 'Amenities', icon: HiCalendar },
    // REMOVED: { path: '/virtual-tour', label: 'Virtual Tour' },
    { path: '/contact', label: 'Contact', icon: HiPhone },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-white border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Branding */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <HiBuildingOffice className="h-10 w-10 text-blue-600 relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  JFI Properties
                </span>
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  Tower <span className="text-blue-600">Three</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative group px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* CTA Button - FIXED: Changed from /schedule-tour to /contact */}
            <button
              onClick={() => navigate('/contact')}
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl active:scale-95"
            >
              Schedule Tour
            </button>

            {/* Admin Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">Admin</span>
                <motion.div
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiChevronDown className="h-4 w-4" />
                </motion.div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 mb-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500 font-medium">Administration</p>
                      </div>
                      <Link
                        to="/admin/login"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="flex-1 font-medium">Portal Login</div>
                        <div className="text-xs text-gray-400 group-hover:text-blue-500">→</div>
                      </Link>
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="flex-1 font-medium">Dashboard</div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={() => navigate('/contact')}  // FIXED: Changed from /schedule-tour to /contact
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg"
            >
              Tour
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isOpen ? (
                <HiXMark className="h-6 w-6" />
              ) : (
                <HiBars3 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Admin Section */}
              <div className="pt-4 mt-4 border-t border-gray-100">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Administration
                </p>
                <Link
                  to="/admin/login"
                  className="flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Portal Login</span>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Dashboard</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;