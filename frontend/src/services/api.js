import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
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
};

// Tower API
export const towerApi = {
  getInfo: () => api.get('/tower'),
  updateInfo: (data) => api.put('/tower', data),
  
  // Feature Images
  uploadFeatureImage: (formData) => api.post('/tower/feature-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteFeatureImage: (publicId) => api.delete('/tower/feature-images', { data: { publicId } }),
  
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
};

export default api;