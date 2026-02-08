import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Layout Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import FloorsPage from './pages/public/FloorsPage';
import FloorDetailsPage from './pages/public/FloorDetailsPage';
import AmenitiesPage from './pages/public/AmenitiesPage';
import ContactPage from './pages/public/ContactPage';
import InquiryFormPage from './pages/public/InquiryFormPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import FloorManagement from './pages/admin/FloorManagement';
import InquiryManagement from './pages/admin/InquiryManagement';
import SettingsPage from './pages/admin/SettingsPage';

// Auth Context & Protected Route
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />

              <Routes>
                {/* ================================================================
                  PUBLIC ROUTES - No authentication required
                  ================================================================ */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="floors" element={<FloorsPage />} />
                  <Route path="floors/:id" element={<FloorDetailsPage />} />
                  <Route path="amenities" element={<AmenitiesPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="inquiry/:floorId" element={<InquiryFormPage />} />

                  {/* Catch-all redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>

                {/* ================================================================
                  ADMIN AUTH ROUTES - Login page (no protection)
                  ================================================================ */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* ================================================================
                  PROTECTED ADMIN ROUTES - Authentication required
                  ================================================================ */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={false}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="floors" element={<FloorManagement />} />
                  <Route path="inquiries" element={<InquiryManagement />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* ================================================================
                  CATCH-ALL - Redirect to home for undefined routes
                  ================================================================ */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;