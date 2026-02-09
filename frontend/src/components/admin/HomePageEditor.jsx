import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPhoto,
  HiVideoCamera,
  HiTrash,
  HiUpload,
  HiOutlinePencil,
  HiArrowsUpDown,
  HiCheck,
  HiXMark,
  HiStar,
  HiOutlineStar,
  HiHome,
  HiInformationCircle,
  HiPlus,
  HiChevronUp,
  HiChevronDown,
  HiOutlineExclamationCircle
} from 'react-icons/hi2';
import { towerApi } from '../../services/api';
import Toast from '../common/Toast';

const HomePageEditor = () => {
  const [towerInfo, setTowerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');
  const [toast, setToast] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // States for forms
  const [videoForm, setVideoForm] = useState({
    youtubeId: '',
    title: '',
    description: '',
    category: 'overview',
    duration: '0:00'
  });

  const [imageForm, setImageForm] = useState({
    title: '',
    description: '',
    category: 'gallery',
    featured: false
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTowerInfo();
  }, []);

  const fetchTowerInfo = async () => {
    try {
      setLoading(true);
      const response = await towerApi.getTowerInfo();
      setTowerInfo(response.data);
    } catch (error) {
      showToast('Error fetching tower information', 'error');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showToast('Please select a valid image file (JPEG, PNG, WebP)', 'error');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      setSelectedFile(file);
      showToast('Image selected. Click upload to proceed.', 'info');
    }
  };

  // Upload image
  const uploadImage = async () => {
    if (!selectedFile) {
      showToast('Please select an image file first', 'error');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', imageForm.title);
      formData.append('description', imageForm.description);
      formData.append('category', imageForm.category);
      formData.append('featured', imageForm.featured.toString());

      await towerApi.uploadImage(formData);

      showToast('Image uploaded successfully!', 'success');
      fetchTowerInfo();

      // Reset form
      setSelectedFile(null);
      setImageForm({
        title: '',
        description: '',
        category: 'gallery',
        featured: false
      });

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      showToast('Error uploading image: ' + error.message, 'error');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Add YouTube video
  const addVideo = async () => {
    try {
      if (!videoForm.youtubeId || !videoForm.title) {
        showToast('YouTube ID and Title are required', 'error');
        return;
      }

      await towerApi.addVideo(videoForm);
      showToast('Video added successfully!', 'success');
      fetchTowerInfo();

      // Reset form
      setVideoForm({
        youtubeId: '',
        title: '',
        description: '',
        category: 'overview',
        duration: '0:00'
      });

    } catch (error) {
      showToast('Error adding video: ' + error.message, 'error');
      console.error('Add video error:', error);
    }
  };

  // Extract YouTube ID from URL
  const extractYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  // Delete image
  const deleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await towerApi.deleteImage(imageId);
      showToast('Image deleted successfully', 'success');
      fetchTowerInfo();
    } catch (error) {
      showToast('Error deleting image', 'error');
    }
  };

  // Delete video
  const deleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      await towerApi.deleteVideo(videoId);
      showToast('Video deleted successfully', 'success');
      fetchTowerInfo();
    } catch (error) {
      showToast('Error deleting video', 'error');
    }
  };

  // Drag and drop functionality
  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetId, category) => {
    e.preventDefault();

    if (!draggingId || draggingId === targetId) return;

    const items = getItemsByCategory(category);
    const draggingIndex = items.findIndex(item => item._id === draggingId);
    const targetIndex = items.findIndex(item => item._id === targetId);

    if (draggingIndex === -1 || targetIndex === -1) return;

    const orderedIds = [...items.map(item => item._id)];
    const [removed] = orderedIds.splice(draggingIndex, 1);
    orderedIds.splice(targetIndex, 0, removed);

    try {
      await towerApi.reorderImages(category, orderedIds);
      showToast('Items reordered successfully', 'success');
      fetchTowerInfo();
    } catch (error) {
      showToast('Error reordering items', 'error');
    }

    setDraggingId(null);
  };

  const getItemsByCategory = (category) => {
    if (!towerInfo) return [];

    switch (category) {
      case 'hero':
        return towerInfo.heroImages || [];
      case 'gallery':
        return towerInfo.galleryImages || [];
      case 'videos':
        return towerInfo.videos || [];
      default:
        return [];
    }
  };

  // Toggle image featured status
  const toggleFeatured = async (imageId, currentFeatured) => {
    try {
      await towerApi.updateImage(imageId, { featured: !currentFeatured });
      showToast(`Image ${!currentFeatured ? 'added to' : 'removed from'} featured`, 'success');
      fetchTowerInfo();
    } catch (error) {
      showToast('Error updating image', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">{previewImage.title}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <HiXMark className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={previewImage.url}
                  alt={previewImage.title}
                  className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                />
                <div className="mt-4 space-y-2">
                  {previewImage.description && (
                    <p className="text-gray-600">{previewImage.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Category: {previewImage.category}</span>
                    <span>{previewImage.featured && '⭐ Featured'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Home Page Editor</h1>
            <p className="text-gray-600">Manage images, videos, and content for the homepage</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <HiInformationCircle className="h-5 w-5" />
            <span>Drag and drop items to reorder</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-2 overflow-x-auto">
            {[
              { id: 'hero', label: 'Hero Images', icon: HiHome },
              { id: 'gallery', label: 'Gallery', icon: HiPhoto },
              { id: 'videos', label: 'Videos', icon: HiVideoCamera },
              { id: 'content', label: 'Content', icon: HiOutlinePencil }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero Images Tab */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Upload Hero Image</h3>
              <div className="space-y-4">
                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Image
                  </label>
                  <div className="mt-1 flex items-center">
                    <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                      <HiUpload className="inline-block h-5 w-5 mr-2" />
                      Choose Image
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </label>
                    {selectedFile && (
                      <div className="ml-3">
                        <p className="text-sm text-gray-700 truncate max-w-[200px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={imageForm.title}
                    onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter image title"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={imageForm.category}
                    onChange={(e) => setImageForm({ ...imageForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="hero">Hero</option>
                    <option value="exterior">Exterior</option>
                    <option value="interior">Interior</option>
                    <option value="common_areas">Common Areas</option>
                    <option value="amenities">Amenities</option>
                  </select>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={imageForm.featured}
                    onChange={(e) => setImageForm({ ...imageForm, featured: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Mark as Featured
                  </label>
                </div>

                {/* Upload Button */}
                <button
                  onClick={uploadImage}
                  disabled={!selectedFile || uploading}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${!selectedFile || uploading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </span>
                  ) : (
                    'Upload Image'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Hero Images List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Hero Images</h3>
                  <span className="text-sm text-gray-500">
                    {towerInfo?.heroImages?.length || 0} images
                  </span>
                </div>
              </div>
              <div className="p-6">
                {towerInfo?.heroImages?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {towerInfo.heroImages.map((image) => (
                      <motion.div
                        key={image._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, image._id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, image._id, 'hero')}
                        className={`relative group border rounded-xl overflow-hidden bg-gray-100 cursor-move transition-all ${draggingId === image._id ? 'opacity-50' : ''
                          }`}
                      >
                        <div className="aspect-video relative">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-full object-cover"
                            onClick={() => {
                              setPreviewImage(image);
                              setShowPreview(true);
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <button
                              onClick={() => setPreviewImage(image)}
                              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                              title="Preview"
                            >
                              <HiPhoto className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteImage(image._id)}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              title="Delete"
                            >
                              <HiTrash className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() => toggleFeatured(image._id, image.featured)}
                              className="p-1 bg-white/80 rounded-full"
                              title={image.featured ? "Remove from featured" : "Add to featured"}
                            >
                              {image.featured ? (
                                <HiStar className="h-5 w-5 text-yellow-500" />
                              ) : (
                                <HiOutlineStar className="h-5 w-5 text-gray-500" />
                              )}
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <p className="text-white text-sm font-medium truncate">
                              {image.title}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HiPhoto className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No hero images uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Upload images to appear in the homepage hero section
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Add YouTube Video</h3>
              <div className="space-y-4">
                {/* YouTube URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube URL or ID
                  </label>
                  <input
                    type="text"
                    value={videoForm.youtubeId}
                    onChange={(e) => {
                      const value = e.target.value;
                      const id = extractYouTubeId(value);
                      setVideoForm({ ...videoForm, youtubeId: id || value });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter full URL or just the video ID
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Video title"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="overview">Overview</option>
                    <option value="walkthrough">Walkthrough</option>
                    <option value="amenities">Amenities</option>
                    <option value="interior">Interior</option>
                    <option value="promo">Promotional</option>
                  </select>
                </div>

                {/* Add Button */}
                <button
                  onClick={addVideo}
                  disabled={!videoForm.youtubeId || !videoForm.title}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${!videoForm.youtubeId || !videoForm.title
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                  Add Video
                </button>
              </div>
            </div>
          </div>

          {/* Videos List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Video Gallery</h3>
                  <span className="text-sm text-gray-500">
                    {towerInfo?.videos?.length || 0} videos
                  </span>
                </div>
              </div>
              <div className="p-6">
                {towerInfo?.videos?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {towerInfo.videos.map((video) => (
                      <motion.div
                        key={video._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, video._id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, video._id, 'videos')}
                        className={`border rounded-xl overflow-hidden bg-gray-100 cursor-move transition-all ${draggingId === video._id ? 'opacity-50' : ''
                          }`}
                      >
                        <div className="aspect-video relative bg-gray-900">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition-transform">
                              <HiVideoCamera className="h-7 w-7 text-white" />
                            </div>
                          </div>
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={() => deleteVideo(video._id)}
                              className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                              title="Delete video"
                            >
                              <HiTrash className="h-4 w-4 text-gray-700" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 bg-white">
                          <h4 className="font-semibold text-gray-900 mb-1 truncate">
                            {video.title}
                          </h4>
                          {video.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {video.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {video.category}
                            </span>
                            <a
                              href={`https://youtube.com/watch?v=${video.youtubeId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              Watch on YouTube →
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HiVideoCamera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No videos added yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add YouTube videos to appear in the video gallery
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Images Tab */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Gallery Images</h3>
            <p className="text-gray-600 mb-6">
              These images will appear in the gallery section of the homepage.
            </p>

            {towerInfo?.galleryImages?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {towerInfo.galleryImages.map((image) => (
                  <div
                    key={image._id}
                    className="relative group border rounded-lg overflow-hidden bg-gray-100"
                  >
                    <div className="aspect-square">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        onClick={() => {
                          setPreviewImage(image);
                          setShowPreview(true);
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setPreviewImage(image)}
                          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                          title="Preview"
                        >
                          <HiPhoto className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteImage(image._id)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                          title="Delete"
                        >
                          <HiTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => toggleFeatured(image._id, image.featured)}
                        className="p-1 bg-white/80 rounded-full"
                        title={image.featured ? "Remove from featured" : "Add to featured"}
                      >
                        {image.featured ? (
                          <HiStar className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <HiOutlineStar className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HiPhoto className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No gallery images yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Upload images with "gallery" category to appear here
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-6">Homepage Content</h3>

            <div className="space-y-6">
              {/* Statistics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Floors
                    </label>
                    <input
                      type="number"
                      defaultValue={towerInfo?.homepageContent?.stats?.totalFloors || 25}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupancy Rate (%)
                    </label>
                    <input
                      type="number"
                      defaultValue={towerInfo?.homepageContent?.stats?.occupancyRate || 92}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Floors
                    </label>
                    <input
                      type="number"
                      defaultValue={towerInfo?.homepageContent?.stats?.availableFloors || 8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Companies
                    </label>
                    <input
                      type="number"
                      defaultValue={towerInfo?.homepageContent?.stats?.totalCompanies || 50}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Hero Section</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      defaultValue={towerInfo?.homepageContent?.heroTitle || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Subtitle
                    </label>
                    <textarea
                      rows="2"
                      defaultValue={towerInfo?.homepageContent?.heroSubtitle || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePageEditor;