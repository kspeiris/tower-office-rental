import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
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
  HiExclamationCircle
} from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import TowerMediaManager from '../../components/admin/TowerMediaManager';

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
        <span className="text-xs font-medium text-gray-600">Password Strength</span>
        <span className={`text-xs font-semibold ${
          strength.level <= 1 ? 'text-red-600' : 
          strength.level === 2 ? 'text-yellow-600' : 
          'text-green-600'
        }`}>
          {strength.label}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
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
      <label className="block text-sm font-medium text-gray-700 mb-1">
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
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <HiUser /> },
    { id: 'security', label: 'Security', icon: <HiLockClosed /> },
    { id: 'company', label: 'Company', icon: <HiOfficeBuilding /> },
    { id: 'notifications', label: 'Notifications', icon: <HiBell /> },
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
        toast.success('Profile updated successfully');
        setIsProfileSaved(true);
        setTimeout(() => setIsProfileSaved(false), 3000);
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSecuritySubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // In a real app, this would call an API endpoint
      // const response = await authApi.changePassword(values);
      console.log('Security update:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password updated successfully');
      resetForm();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings | TowerSpace Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and system preferences</p>
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
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
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
                    <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                    <p className="text-sm text-gray-600 mt-1">Update your account information</p>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
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

                      <div className="pt-6 border-t">
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
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Security Settings</h2>
                  <p className="text-sm text-gray-600 mb-6">Manage your password and security preferences</p>
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
                          <p className="mt-2 text-xs text-gray-500">
                            Password requirements:
                            <ul className="list-disc ml-5 mt-1 space-y-1">
                              <li>At least 6 characters</li>
                              <li>At least one uppercase letter (A-Z)</li>
                              <li>At least one lowercase letter (a-z)</li>
                              <li>At least one number (0-9)</li>
                            </ul>
                          </p>
                        </div>

                        <PasswordField
                          label="Confirm New Password"
                          name="confirmPassword"
                          showPassword={showConfirmPassword}
                          onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                          error={touched.confirmPassword && errors.confirmPassword}
                        />
                      </div>

                      <div className="pt-6 border-t">
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">Company Information</h2>
                <p className="text-gray-600 mb-6">
                  Manage your company details and branding.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <HiOfficeBuilding className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Company settings form coming soon</p>
                </div>
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
                <p className="text-gray-600 mb-6">
                  Configure how and when you receive notifications.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <HiBell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Notification preferences coming soon</p>
                </div>
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">Tower Media Management</h2>
                <p className="text-gray-600 mb-6">
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