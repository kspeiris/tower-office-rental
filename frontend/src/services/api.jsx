import axios from 'axios';

const getApiUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Fallback for CRA or other environments if still used
  try {
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
  } catch (e) {
    // process is not defined
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid credentials
      const hadToken = !!localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect if we are currently on an admin page or had a token
      // this prevents public users from being randomly redirected to login
      const isParamAdmin = window.location.pathname.startsWith('/admin');

      if (isParamAdmin && window.location.pathname !== '/admin/login' && hadToken) {
        window.location.href = '/admin/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Floor API
export const floorApi = {
  getAll: (params) => api.get('/floors', { params }),
  getAvailable: () => api.get('/floors/available'),
  getFeatured: () => api.get('/floors/featured'),
  getById: (id) => api.get(`/floors/${id}`),
  create: (data) => {
    // Handle FormData for file uploads
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.post('/floors', data, config);
  },
  update: (id, data) => {
    // Handle FormData for file uploads
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.put(`/floors/${id}`, data, config);
  },
  delete: (id) => api.delete(`/floors/${id}`),
  deleteImage: (id, imageUrl) => api.delete(`/floors/${id}/images`, { data: { imageUrl } }),
};

// Inquiry API
export const inquiryApi = {
  create: (data) => api.post('/inquiries', data),
  getAll: (params) => api.get('/inquiries', { params }),
  getById: (id) => api.get(`/inquiries/${id}`),
  updateStatus: (id, data) => api.patch(`/inquiries/${id}/status`, data),
  getStats: () => api.get('/inquiries/stats'),
};

// Admin API
export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id, isActive) => api.patch(`/admin/users/${id}/status`, { isActive }),
  createUser: (userData) => api.post('/admin/users', userData),
};

// Tower API
export const towerApi = {
  getPublicStats: () => api.get('/tower/stats'),
  getInfo: () => api.get('/tower'),
  updateInfo: (data) => api.put('/tower', data),

  // Feature Images
  uploadFeatureImage: (formData) => api.post('/tower/feature-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteFeatureImage: (publicId) => api.delete('/tower/feature-images', { data: { publicId } }),
  toggleHeroImage: (publicId, isHeroImage) => api.patch(`/tower/feature-images/${publicId}/hero`, { isHeroImage }),

  // YouTube Videos
  addYoutubeVideo: (data) => api.post('/tower/youtube-videos', data),
  deleteYoutubeVideo: (videoId) => api.delete('/tower/youtube-videos', { data: { videoId } })
};

// Auth API
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/update-password', data),
  updatePreferences: (data) => api.put('/auth/preferences', data),
};

export default api;