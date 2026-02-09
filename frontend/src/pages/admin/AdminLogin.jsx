import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiOfficeBuilding, HiLockClosed, HiMail, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordBlur = () => {
    if (password && password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submit
    let hasErrors = false;
    const newErrors = { email: '', password: '' };

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      hasErrors = true;
    }

    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({ email: '', password: '' });

    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        toast.success('Login successful!');
        navigate('/admin');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Invalid email or password';
      toast.error(errorMessage);

      // Set field-specific error if available
      if (error.response?.data?.field) {
        setErrors(prev => ({
          ...prev,
          [error.response.data.field]: errorMessage
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | TowerSpace</title>
        <meta name="description" content="Sign in to TowerSpace admin dashboard" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-500">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sm:mx-auto sm:w-full sm:max-w-md"
        >
          <div className="text-center">
            <div className="flex justify-center">
              <HiOfficeBuilding className="h-14 w-14 text-primary-600 dark:text-primary-400 drop-shadow-lg" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Tower<span className="text-primary-600 dark:text-primary-400">Space</span> Admin
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
              Sign in to manage your office spaces
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        >
          <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow-2xl dark:shadow-black/40 sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-gray-800">
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiMail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    onBlur={handleEmailBlur}
                    disabled={isLoading}
                    className={`appearance-none block w-full pl-10 pr-3 py-2.5 border rounded-xl placeholder-gray-400 dark:placeholder-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all ${errors.email
                        ? 'border-red-300 dark:border-red-900 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-transparent'
                      }`}
                    placeholder="admin@towerspace.com"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    onBlur={handlePasswordBlur}
                    disabled={isLoading}
                    className={`appearance-none block w-full pl-10 pr-10 py-2.5 border rounded-xl placeholder-gray-400 dark:placeholder-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all ${errors.password
                        ? 'border-red-300 dark:border-red-900 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-transparent'
                      }`}
                    placeholder="••••••••"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" aria-hidden="true" />
                    ) : (
                      <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300 font-medium">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => toast('Please contact support to reset your password', {
                      icon: 'ℹ️',
                      duration: 4000
                    })}
                    className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            {/* Return to Website */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase text-[10px]">Return to website</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-primary-600 hover:text-primary-500 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
                >
                  ← Back to TowerSpace
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Demo Credentials Info (Remove in production) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        >
          <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-900/20 rounded-2xl p-4 shadow-inner">
            <p className="text-sm text-primary-800 dark:text-primary-300 text-center font-medium">
              <span className="font-black uppercase tracking-widest text-[10px] bg-primary-200 dark:bg-primary-800 px-2 py-0.5 rounded-full mr-2">Demo</span>
              Use any valid email and password (min 6 chars)
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;