import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  HiMoon,
  HiArrowRight,
  HiSparkles,
  HiUser,
  HiHome,
  HiCog
} from 'react-icons/hi2';
import { useTheme } from '../../contexts/ThemeContext';

// ============================================================================
// CUSTOM HOOKS
// ============================================================================
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
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

const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 10) {
        setScrollDirection(direction);
      }
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };
    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection, lastScrollY]);

  return scrollDirection;
};

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================
const NavItem = ({ item, isActive, hovered, onMouseEnter, onMouseLeave, index }) => {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onMouseEnter={() => onMouseEnter(item.path)}
      onMouseLeave={onMouseLeave}
      className={`relative px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 group ${isActive
        ? 'text-emerald-700 dark:text-emerald-300'
        : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
        }`}
      style={{ animationDelay: `${index * 30}ms` }}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Subtle active background */}
      {isActive && (
        <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg opacity-80"></div>
      )}

      {/* Hover background */}
      {!isActive && hovered === item.path && (
        <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-60"></div>
      )}

      <div className="relative flex items-center space-x-2">
        <Icon className={`h-4 w-4 transition-all duration-200 ${isActive
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400'
          }`} />
        <span>{item.label}</span>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
      )}
    </Link>
  );
};

const MobileNavItem = ({ item, isActive, onClick, index }) => {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-base transition-all duration-200 ${isActive
        ? 'bg-emerald-50/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 backdrop-blur-sm'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 backdrop-blur-sm'
        }`}
      style={{
        animationDelay: `${index * 30}ms`,
        animation: 'slideInRight 0.3s ease forwards',
        opacity: 0
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg transition-all duration-200 ${isActive
          ? 'bg-emerald-100 dark:bg-emerald-900/40'
          : 'bg-gray-100 dark:bg-gray-800'
          }`}>
          <Icon className={`h-4 w-4 ${isActive
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-gray-500 dark:text-gray-400'
            }`} />
        </div>
        <span>{item.label}</span>
      </div>
      <HiArrowRight className={`h-4 w-4 transition-all duration-200 ${isActive
        ? 'text-emerald-500 dark:text-emerald-400'
        : 'text-gray-400 dark:text-gray-500'
        }`} />
    </Link>
  );
};

// ============================================================================
// MAIN NAVBAR COMPONENT
// ============================================================================
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const scrollDirection = useScrollDirection();

  // Navigation items configuration
  const navItems = [
    { path: '/', label: 'Home', icon: HiHome },
    { path: '/floors', label: 'Floor Plans', icon: HiMapPin },
    { path: '/amenities', label: 'Amenities', icon: HiCalendar },
    { path: '/contact', label: 'Contact', icon: HiPhone },
  ];

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on resize
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

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Click outside for dropdown
  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  // Active path checker
  const isActive = (path) => location.pathname === path;

  // Handle navigation
  const handleNavigate = useCallback((path) => {
    setIsOpen(false);
    navigate(path);
  }, [navigate]);

  return (
    <>
      {/* Subtle progress indicator */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-emerald-200 dark:bg-emerald-800 z-[60]">
        <div className="h-full bg-emerald-500 dark:bg-emerald-400 w-1/3 animate-shimmer"></div>
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${scrollDirection === 'down' && scrolled ? '-translate-y-full' : 'translate-y-0'
          } ${scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800'
            : 'bg-white dark:bg-gray-900'
          }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 lg:h-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 rounded-lg"
              aria-label="JFI Properties Tower Three - Home"
            >
              <div className="relative p-2 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors duration-200">
                <HiBuildingOffice className="h-5 w-5 lg:h-6 lg:w-6 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em]">
                  JFI Properties
                </span>
                <span className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                  Tower <span className="text-emerald-600 dark:text-emerald-400">Three</span>
                </span>
              </div>

              <div className="sm:hidden">
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  JFI <span className="text-emerald-600 dark:text-emerald-400">T3</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <NavItem
                  key={item.path}
                  item={item}
                  isActive={isActive(item.path)}
                  hovered={hoveredItem}
                  onMouseEnter={setHoveredItem}
                  onMouseLeave={() => setHoveredItem(null)}
                  index={index}
                />
              ))}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative p-2 ml-1 rounded-lg text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? (
                  <HiSun className="h-4 w-4" />
                ) : (
                  <HiMoon className="h-4 w-4" />
                )}
              </button>

              {/* CTA Button */}
              <button
                onClick={() => handleNavigate('/contact')}
                className="relative ml-3 px-4 py-2 bg-emerald-600 dark:bg-emerald-700 text-white font-medium text-sm rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
                aria-label="Schedule a tour of Tower Three"
              >
                <div className="flex items-center space-x-1.5">
                  <HiSparkles className="h-3.5 w-3.5" />
                  <span>Schedule Tour</span>
                </div>
              </button>

              {/* Admin Dropdown */}
              <div className="relative ml-1" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-1.5 px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 group"
                  aria-label="Admin menu"
                  aria-expanded={dropdownOpen}
                >
                  <HiUser className="h-4 w-4" />
                  <span className="font-medium text-sm">Admin</span>
                  <HiChevronDown className={`h-3 w-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-slideDown">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-[0.1em]">Administration</p>
                      </div>
                      <Link
                        to="/admin/login"
                        className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 rounded transition-colors duration-150 group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>Portal Login</span>
                        <HiArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150" />
                      </Link>
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 rounded transition-colors duration-150 group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>Dashboard</span>
                        <HiArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? (
                  <HiSun className="h-4 w-4" />
                ) : (
                  <HiMoon className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={() => handleNavigate('/contact')}
                className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-200"
                aria-label="Schedule a tour"
              >
                <HiPhone className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <HiXMark className="h-5 w-5" />
                ) : (
                  <HiBars3 className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 z-[45] lg:hidden bg-black/30 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsOpen(false)}
            role="button"
            aria-label="Close menu"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setIsOpen(false)}
          />

          {/* Menu Panel with backdrop blur */}
          <div className="fixed inset-x-0 top-14 bottom-0 z-50 lg:hidden overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-md animate-slideUp">
            <div className="h-0.5 bg-emerald-500 dark:bg-emerald-400"></div>

            <div className="px-4 py-6 space-y-1">
              {navItems.map((item, index) => (
                <MobileNavItem
                  key={item.path}
                  item={item}
                  isActive={isActive(item.path)}
                  onClick={() => handleNavigate(item.path)}
                  index={index}
                />
              ))}

              {/* Admin Section */}
              <div
                className="pt-8 mt-6 border-t border-gray-200 dark:border-gray-700"
                style={{
                  animationDelay: '120ms',
                  animation: 'slideInRight 0.3s ease forwards',
                  opacity: 0
                }}
              >
                <div className="flex items-center space-x-2 px-2 mb-4">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-[0.1em] px-2">
                    Administration
                  </p>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-emerald-50/80 dark:hover:bg-emerald-900/30 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 mb-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <HiArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Portal</span>
                  </Link>

                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-emerald-50/80 dark:hover:bg-emerald-900/30 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 mb-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <HiCog className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dashboard</span>
                  </Link>
                </div>
              </div>

              {/* CTA for mobile */}
              <div
                className="pt-6"
                style={{
                  animationDelay: '150ms',
                  animation: 'slideInRight 0.3s ease forwards',
                  opacity: 0
                }}
              >
                <button
                  onClick={() => handleNavigate('/contact')}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 bg-emerald-600 dark:bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-200 backdrop-blur-sm"
                  aria-label="Schedule a tour of Tower Three"
                >
                  <HiPhone className="h-4 w-4" />
                  <span>Schedule a Tour</span>
                  <HiSparkles className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Global Animations CSS */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-8px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        /* Apply animations */
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.25s ease forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease forwards;
        }
      `}</style>
    </>
  );
};

export default Navbar;