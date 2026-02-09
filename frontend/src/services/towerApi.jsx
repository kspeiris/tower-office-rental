import api from './api';

const towerApi = {
  // Get tower information
  getTowerInfo: () => api.get('/tower'),
  
  // Update tower information
  updateTowerInfo: (data) => api.put('/tower', data),
  
  // Image operations
  uploadImage: (formData) => {
    return api.post('/tower/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  updateImage: (imageId, data) => api.put(`/tower/images/${imageId}`, data),
  
  deleteImage: (imageId) => api.delete(`/tower/images/${imageId}`),
  
  getImagesByCategory: (category) => api.get(`/tower/images/${category}`),
  
  reorderImages: (category, orderedIds) => 
    api.put('/tower/images/reorder', { category, orderedIds }),
  
  // Video operations
  addVideo: (videoData) => api.post('/tower/videos', videoData),
  
  updateVideo: (videoId, data) => api.put(`/tower/videos/${videoId}`, data),
  
  deleteVideo: (videoId) => api.delete(`/tower/videos/${videoId}`),
  
  getVideos: () => api.get('/tower/videos')
};

export default towerApi;