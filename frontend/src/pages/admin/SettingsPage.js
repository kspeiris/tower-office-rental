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
  HiSave
} from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <HiUser /> },
    { id: 'security', label: 'Security', icon: <HiLockClosed /> },
    { id: 'company', label: 'Company', icon: <HiOfficeBuilding /> },
    { id: 'notifications', label: 'Notifications', icon: <HiBell /> }
  ];

  const profileValidationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters'),
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
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSecuritySubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // In a real app, this would call an API endpoint
      console.log('Security update:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password updated successfully');
      resetForm();
    } catch (error) {
      toast.error('Failed to update password');
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
            <div className="card p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    <span>{tab.label}</span>
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
                className="card p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                
                <Formik
                  initialValues={{
                    username: user?.username || '',
                    email: user?.email || ''
                  }}
                  validationSchema={profileValidationSchema}
                  onSubmit={handleProfileSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <HiUser className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              type="text"
                              name="username"
                              className="pl-10 input-field"
                            />
                          </div>
                          <ErrorMessage name="username" component="div" className="mt-1 text-sm text-red-600" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <HiMail className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              type="email"
                              name="email"
                              className="pl-10 input-field"
                            />
                          </div>
                          <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div className="pt-6 border-t">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-primary inline-flex items-center"
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
                className="card p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
                
                <Formik
                  initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  }}
                  validationSchema={securityValidationSchema}
                  onSubmit={handleSecuritySubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <HiLockClosed className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              type="password"
                              name="currentPassword"
                              className="pl-10 input-field"
                            />
                          </div>
                          <ErrorMessage name="currentPassword" component="div" className="mt-1 text-sm text-red-600" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <HiLockClosed className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              type="password"
                              name="newPassword"
                              className="pl-10 input-field"
                            />
                          </div>
                          <ErrorMessage name="newPassword" component="div" className="mt-1 text-sm text-red-600" />
                          <p className="mt-1 text-sm text-gray-500">
                            Password must be at least 6 characters with uppercase, lowercase, and number.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <HiLockClosed className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              type="password"
                              name="confirmPassword"
                              className="pl-10 input-field"
                            />
                          </div>
                          <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div className="pt-6 border-t">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-primary inline-flex items-center"
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
                className="card p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Company Information</h2>
                <p className="text-gray-600 mb-6">
                  Manage your company details and branding.
                </p>
                {/* Company settings form would go here */}
              </motion.div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                <p className="text-gray-600 mb-6">
                  Configure how and when you receive notifications.
                </p>
                {/* Notification settings would go here */}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;