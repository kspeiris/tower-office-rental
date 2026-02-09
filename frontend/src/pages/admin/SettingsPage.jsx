import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  HiUser,
  HiMail,
  HiLockClosed,
  HiOfficeBuilding,
  HiGlobe,
  HiBell,
  HiSave,
  HiPhotograph,
  HiEye,
  HiEyeOff,
  HiCheckCircle,
  HiExclamationCircle,
  HiUsers,
  HiChartBar,
  HiPlus,
  HiX
} from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import TowerMediaManager from '../../components/admin/TowerMediaManager';
import { towerApi, adminApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// ============================================================================
// PASSWORD STRENGTH INDICATOR
// ============================================================================
const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (!password) return { level: 0, label: '', color: '' };

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    const levels = [
      { level: 0, label: 'No password', color: 'bg-gray-300' },
      { level: 1, label: 'Weak', color: 'bg-red-500' },
      { level: 2, label: 'Fair', color: 'bg-yellow-500' },
      { level: 3, label: 'Good', color: 'bg-blue-500' },
      { level: 4, label: 'Strong', color: 'bg-green-500' },
      { level: 5, label: 'Very Strong', color: 'bg-green-600' }
    ];

    return levels[Math.min(strength, 5)];
  };

  const strength = getStrength();
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Password Strength</span>
        <span className={`text-xs font-semibold ${strength.level <= 1 ? 'text-red-600' :
          strength.level === 2 ? 'text-yellow-600' :
            'text-green-600'
          }`}>
          {strength.label}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${(strength.level / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// PASSWORD VISIBILITY TOGGLE
// ============================================================================
const PasswordField = ({ label, name, showPassword, onToggle, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <HiLockClosed className="h-5 w-5 text-gray-400" />
        </div>
        <Field
          type={showPassword ? 'text' : 'password'}
          name={name}
          className="pl-10 pr-10 input-field"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <HiEyeOff className="h-5 w-5" />
          ) : (
            <HiEye className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && <div className="mt-1 text-sm text-red-600 flex items-center"><HiExclamationCircle className="mr-1 h-4 w-4" />{error}</div>}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SettingsPage = () => {
  const { user, updateProfile, updatePassword, updatePreferences } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [towerInfo, setTowerInfo] = useState(null);
  const [loadingTower, setLoadingTower] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  // Tabs - users only for super_admin
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <HiUser /> },
    { id: 'security', label: 'Security', icon: <HiLockClosed /> },
    { id: 'company', label: 'Company', icon: <HiOfficeBuilding /> },
    { id: 'notifications', label: 'Notifications', icon: <HiBell /> },
    ...(user?.role === 'super_admin' ? [{ id: 'users', label: 'Users', icon: <HiUsers /> }] : []),
    { id: 'media', label: 'Tower Media', icon: <HiPhotograph /> }
  ];

  const profileValidationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .matches(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
  });

  const securityValidationSchema = Yup.object({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .required('New password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
  });

  const handleProfileSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await updateProfile(values);
      if (result.success) {
        setIsProfileSaved(true);
        setTimeout(() => setIsProfileSaved(false), 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSecuritySubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const result = await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });

      if (result.success) {
        resetForm();
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchTowerInfo = async () => {
    try {
      setLoadingTower(true);
      const response = await towerApi.getInfo();
      setTowerInfo(response.data.towerInfo);
    } catch (error) {
      console.error('Error fetching tower info:', error);
      toast.error('Failed to load company information');
    } finally {
      setLoadingTower(false);
    }
  };

  const handleCompanySubmit = async (values, { setSubmitting }) => {
    try {
      const response = await towerApi.updateInfo(values);
      if (response.data) {
        setTowerInfo(response.data.towerInfo);
        toast.success('Company information updated successfully');
      }
    } catch (error) {
      console.error('Error updating tower info:', error);
      toast.error('Failed to update company information');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreferenceToggle = async (key, value) => {
    try {
      const newPreferences = {
        ...user.preferences,
        [key]: value
      };
      await updatePreferences(newPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await adminApi.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminApi.toggleUserStatus(userId, !currentStatus);
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleAddUser = async (values, { setSubmitting, resetForm }) => {
    try {
      await adminApi.createUser(values);
      toast.success('New administrator added successfully');
      setShowAddUser(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error(error.response?.data?.error || 'Failed to add administrator');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'company') {
      fetchTowerInfo();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  return (
    <>
      <Helmet>
        <title>Settings | TowerSpace Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and system preferences</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-l-4 border-primary-700 font-bold'
                      : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent'
                      }`}
                  >
                    <span className="mr-3 text-lg">{tab.icon}</span>
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="card p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update your account information</p>
                  </div>
                  {isProfileSaved && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center text-green-600"
                    >
                      <HiCheckCircle className="h-6 w-6 mr-2" />
                      <span className="text-sm font-medium">Saved</span>
                    </motion.div>
                  )}
                </div>

                <Formik
                  initialValues={{
                    username: user?.username || '',
                    email: user?.email || ''
                  }}
                  validationSchema={profileValidationSchema}
                  onSubmit={handleProfileSubmit}
                  enableReinitialize={true}
                >
                  {({ isSubmitting, values, touched }) => (
                    <Form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Username
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <HiUser className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              type="text"
                              name="username"
                              placeholder="Enter your username"
                              className="pl-10 input-field focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                          </div>
                          <ErrorMessage name="username" component="div" className="mt-1 text-sm text-red-600 flex items-center"><HiExclamationCircle className="mr-1 h-4 w-4" /></ErrorMessage>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <HiMail className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              type="email"
                              name="email"
                              placeholder="Enter your email address"
                              className="pl-10 input-field focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                          </div>
                          <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600 flex items-center"><HiExclamationCircle className="mr-1 h-4 w-4" /></ErrorMessage>
                        </div>
                      </div>

                      <div className="pt-6 border-t dark:border-gray-700">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <HiSave className="mr-2 h-5 w-5" />
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </motion.div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="card p-8"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Security Settings</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Manage your password and security preferences</p>
                </div>

                <Formik
                  initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  }}
                  validationSchema={securityValidationSchema}
                  onSubmit={handleSecuritySubmit}
                >
                  {({ isSubmitting, values, errors, touched }) => (
                    <Form className="space-y-6">
                      <div className="space-y-5">
                        <PasswordField
                          label="Current Password"
                          name="currentPassword"
                          showPassword={showCurrentPassword}
                          onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
                          error={touched.currentPassword && errors.currentPassword}
                        />

                        <div>
                          <PasswordField
                            label="New Password"
                            name="newPassword"
                            showPassword={showNewPassword}
                            onToggle={() => setShowNewPassword(!showNewPassword)}
                            error={touched.newPassword && errors.newPassword}
                          />
                          <PasswordStrengthIndicator password={values.newPassword} />
                          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                              Password requirements:
                            </p>
                            <ul className="list-disc ml-5 space-y-1 text-xs text-gray-600 dark:text-gray-400 font-medium">
                              <li>At least 6 characters</li>
                              <li>At least one uppercase letter (A-Z)</li>
                              <li>At least one lowercase letter (a-z)</li>
                              <li>At least one number (0-9)</li>
                            </ul>
                          </div>
                        </div>

                        <PasswordField
                          label="Confirm New Password"
                          name="confirmPassword"
                          showPassword={showConfirmPassword}
                          onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                          error={touched.confirmPassword && errors.confirmPassword}
                        />
                      </div>

                      <div className="pt-6 border-t dark:border-gray-700">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <HiSave className="mr-2 h-5 w-5" />
                          {isSubmitting ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </motion.div>
            )}

            {/* Company Settings */}
            {activeTab === 'company' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="card p-8"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Company Information</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your tower branding and contact details</p>
                </div>

                {loadingTower ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <Formik
                    initialValues={{
                      name: towerInfo?.name || '',
                      description: towerInfo?.description || '',
                      address: towerInfo?.address || '',
                      phone: towerInfo?.phone || '',
                      email: towerInfo?.email || '',
                      website: towerInfo?.website || ''
                    }}
                    onSubmit={handleCompanySubmit}
                    enableReinitialize={true}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                              Tower Name
                            </label>
                            <Field
                              type="text"
                              name="name"
                              className="input-field"
                              placeholder="e.g. JFI Tower 3"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                              Description
                            </label>
                            <Field
                              as="textarea"
                              name="description"
                              rows="3"
                              className="input-field"
                              placeholder="Describe your property..."
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                              Full Address
                            </label>
                            <Field
                              type="text"
                              name="address"
                              className="input-field"
                              placeholder="123 Business St, City, Country"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                              Contact Phone
                            </label>
                            <Field
                              type="text"
                              name="phone"
                              className="input-field"
                              placeholder="+1 234 567 890"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                              Contact Email
                            </label>
                            <Field
                              type="email"
                              name="email"
                              className="input-field"
                              placeholder="info@yourtower.com"
                            />
                          </div>
                        </div>

                        <div className="pt-6 border-t dark:border-gray-700">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <HiSave className="mr-2 h-5 w-5" />
                            {isSubmitting ? 'Saving...' : 'Update Tower Info'}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
              </motion.div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="card p-8"
              >
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure how you want to be notified of new activity</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-primary-100 dark:hover:border-primary-900/30">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl">
                        <HiMail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Email Notifications</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive an email whenever a new inquiry is submitted</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={user?.preferences?.emailNotifications ?? true}
                        onChange={(e) => handlePreferenceToggle('emailNotifications', e.target.checked)}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-primary-100 dark:hover:border-primary-900/30">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl">
                        <HiChartBar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Weekly Performance Reports</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get a weekly summary of occupancy and inquiry statistics</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={user?.preferences?.weeklyReports ?? false}
                        onChange={(e) => handlePreferenceToggle('weeklyReports', e.target.checked)}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl">
                  <div className="flex items-start space-x-3">
                    <HiExclamationCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm">Real-time Updates</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
                        Email notifications are sent to your account email address: <span className="font-bold underline">{user?.email}</span>. You can change this in the Profile tab.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* User Management Settings */}
            {activeTab === 'users' && user?.role === 'super_admin' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="card p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage admin access and user status</p>
                  </div>
                  <button
                    onClick={() => setShowAddUser(!showAddUser)}
                    className="btn-primary inline-flex items-center"
                  >
                    {showAddUser ? (
                      <>
                        <HiX className="mr-2 h-5 w-5" /> Cancel
                      </>
                    ) : (
                      <>
                        <HiPlus className="mr-2 h-5 w-5" /> Add New Admin
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {showAddUser && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-8"
                    >
                      <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:border-primary-100 dark:hover:border-primary-900/30">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <HiUser className="mr-2 h-5 w-5 text-primary-600" />
                          Add New Administrator
                        </h3>
                        <Formik
                          initialValues={{
                            username: '',
                            email: '',
                            password: '',
                            role: 'admin'
                          }}
                          validationSchema={Yup.object({
                            username: Yup.string().required('Required').min(3),
                            email: Yup.string().email('Invalid email').required('Required'),
                            password: Yup.string().required('Required').min(6),
                            role: Yup.string().oneOf(['admin', 'super_admin']).required('Required')
                          })}
                          onSubmit={handleAddUser}
                        >
                          {({ isSubmitting }) => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Username</label>
                                <Field name="username" className="input-field" placeholder="john_doe" />
                                <ErrorMessage name="username" component="div" className="text-red-500 text-[10px] font-bold" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Email Address</label>
                                <Field name="email" type="email" className="input-field" placeholder="john@example.com" />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-[10px] font-bold" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Initial Password</label>
                                <Field name="password" type="password" className="input-field" placeholder="••••••••" />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-[10px] font-bold" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Role</label>
                                <Field as="select" name="role" className="input-field">
                                  <option value="admin">Admin</option>
                                  <option value="super_admin">Super Admin</option>
                                </Field>
                                <ErrorMessage name="role" component="div" className="text-red-500 text-[10px] font-bold" />
                              </div>
                              <div className="md:col-span-2 pt-2">
                                <button type="submit" disabled={isSubmitting} className="btn-primary w-full shadow-lg shadow-primary-500/20">
                                  {isSubmitting ? 'Adding...' : 'Create Admin Account'}
                                </button>
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {loadingUsers ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-gray-800 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                          <th className="px-4 py-4">User</th>
                          <th className="px-4 py-4">Role</th>
                          <th className="px-4 py-4">Status</th>
                          <th className="px-4 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-800">
                        {users.map((u) => (
                          <tr key={u._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mr-3">
                                  {u.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 dark:text-white">{u.username}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${u.role === 'super_admin'
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                }`}>
                                {u.role.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`flex items-center text-xs font-bold ${u.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${u.isActive ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                {u.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              {u._id !== user._id && u.role !== 'super_admin' ? (
                                <button
                                  onClick={() => toggleUserStatus(u._id, u.isActive)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${u.isActive
                                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10'
                                    : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10'
                                    }`}
                                >
                                  {u.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                              ) : (
                                <span className="text-xs text-gray-400 italic">Self / Restricted</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* Tower Media Settings */}
            {activeTab === 'media' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="card p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tower Media Management</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Manage feature images and YouTube videos displayed on the homepage.
                </p>
                <TowerMediaManager />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;