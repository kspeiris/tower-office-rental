import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiBars3,
  HiXMark,
  HiChevronDown,
  HiBuildingOffice,
  HiPhone,
  HiCalendar,
  HiMapPin,
  HiSun,
  HiMoon
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

// Close mobile menu on route change
const useCloseMenuOnNavigate = (setIsOpen) => {
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, setIsOpen]);
};

// Click outside hook
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// Improved scroll lock for iOS
const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      // Save current scroll position
      const scrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Apply styles
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore styles
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLocked]);
};

// ============================================================================
// MAIN NAVBAR COMPONENT
// ============================================================================
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Refs for click outside detection
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close mobile menu on navigation
  useCloseMenuOnNavigate(setIsOpen);

  // Apply scroll lock when mobile menu is open
  useScrollLock(isOpen);

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => {
    if (dropdownOpen) {
      setDropdownOpen(false);
    }
  });

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when screen is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
        setDropdownOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll on iOS when menu is open
  useEffect(() => {
    if (isOpen) {
      const handleTouchMove = (e) => {
        if (!mobileMenuRef.current?.contains(e.target)) {
          e.preventDefault();
        }
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: HiBuildingOffice },
    { path: '/floors', label: 'Floor Plans', icon: HiMapPin },
    { path: '/amenities', label: 'Amenities', icon: HiCalendar },
    { path: '/contact', label: 'Contact', icon: HiPhone },
  ];

  const isActive = (path) => location.pathname === path;

  // Toggle dropdown with proper touch support
  const handleDropdownToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  // Handle desktop hover (only for desktop)
  const handleDropdownMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      setDropdownOpen(true);
    }
  };

  const handleDropdownMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      setDropdownOpen(false);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
      ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-100 dark:border-gray-800'
      : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo with Branding */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 group outline-none">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-200"></div>
                <HiBuildingOffice className="h-8 w-8 lg:h-10 lg:w-10 text-primary-600 relative z-10 group-focus:ring-2 group-focus:ring-offset-2 group-focus:ring-emerald-500 rounded" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs lg:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  JFI Properties
                </span>
                <span className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Tower <span className="text-primary-600 font-black">Three</span>
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
                  className={`relative group px-4 py-2 rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${isActive(item.path)
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95 outline-none focus:ring-2 focus:ring-primary-500 ml-2"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ rotate: -20, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 20, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <HiSun className="h-5 w-5 text-amber-400" /> : <HiMoon className="h-5 w-5 text-primary-600" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/contact')}
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20 hover:shadow-xl active:scale-95 outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-label="Schedule a tour"
            >
              Schedule Tour
            </button>

            {/* Admin Dropdown */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Admin menu"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span className="font-medium text-sm">Admin</span>
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
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                    role="menu"
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 mb-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Administration</p>
                      </div>
                      <Link
                        to="/admin/login"
                        className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors group outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                        onClick={() => setDropdownOpen(false)}
                        role="menuitem"
                      >
                        <div className="font-medium">Portal Login</div>
                        <div className="text-xs text-gray-400 group-hover:text-primary-500">→</div>
                      </Link>
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                        onClick={() => setDropdownOpen(false)}
                        role="menuitem"
                      >
                        <div className="font-medium">Dashboard</div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors active:scale-95"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isDark ? <HiSun className="h-5 w-5 text-amber-400" /> : <HiMoon className="h-5 w-5 text-primary-600" />}
                </motion.div>
              </AnimatePresence>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 active:scale-95"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isOpen ? (
                    <HiXMark className="h-7 w-7" />
                  ) : (
                    <HiBars3 className="h-7 w-7" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-[70] lg:hidden overflow-y-auto overscroll-contain"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <HiBuildingOffice className="h-8 w-8 text-primary-600" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      Tower <span className="text-primary-600 font-black">Three</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:scale-95"
                    aria-label="Close menu"
                  >
                    <HiXMark className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-4 px-4 py-4 rounded-xl text-lg font-bold transition-all active:scale-[0.98] ${active
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
                          }`}
                      >
                        <div className={`p-2 rounded-lg ${active ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                          {Icon && <Icon className="h-6 w-6" />}
                        </div>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
                      Administration
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/admin/login"
                        onClick={() => setIsOpen(false)}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all border border-transparent hover:border-primary-100 dark:hover:border-primary-900/50 active:scale-[0.98]"
                      >
                        <span className="text-sm font-bold">Portal</span>
                      </Link>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all border border-transparent hover:border-primary-100 dark:hover:border-primary-900/50 active:scale-[0.98]"
                      >
                        <span className="text-sm font-bold">Dashboard</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Mobile Menu Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/contact');
                    }}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 active:scale-[0.98] transition-transform"
                  >
                    <HiPhone className="h-5 w-5" />
                    <span>Schedule a Tour</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;