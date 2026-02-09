import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPhotograph,  // FIXED: Changed from HiPhoto to HiPhotograph
  HiVideoCamera,
  HiTrash,
  HiPencil,
  HiX,
  HiUpload,
  HiCheckCircle,
  HiExclamationCircle
} from 'react-icons/hi';
import { towerApi } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const TowerMediaManager = () => {
  const [activeTab, setActiveTab] = useState('images');
  const [towerData, setTowerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Image upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageForm, setImageForm] = useState({
    title: '',
    description: '',
    category: 'exterior',
    order: 0,
    isHeroImage: false
  });

  // Video form states
  const [videoForm, setVideoForm] = useState({
    url: '',
    title: '',
    description: '',
    category: 'tour',
    order: 0
  });

  useEffect(() => {
    fetchTowerData();
  }, []);

  const fetchTowerData = async () => {
    try {
      setLoading(true);
      const response = await towerApi.getInfo();
      setTowerData(response.data.towerInfo || {});
    } catch (error) {
      toast.error('Failed to load tower data');
    } finally {
      setLoading(false);
    }
  };

  // Handle image file selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Upload feature image
  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('title', imageForm.title);
      formData.append('description', imageForm.description);
      formData.append('category', imageForm.category);
      formData.append('order', imageForm.order);
      formData.append('isHeroImage', imageForm.isHeroImage);

      await towerApi.uploadFeatureImage(formData);

      toast.success('Image uploaded successfully');

      // Reset form
      setImageFile(null);
      setImagePreview(null);
      setImageForm({
        title: '',
        description: '',
        category: 'exterior',
        order: 0,
        isHeroImage: false
      });

      fetchTowerData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Delete feature image
  const handleImageDelete = async (publicId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await towerApi.deleteFeatureImage(publicId);
      toast.success('Image deleted successfully');
      fetchTowerData();
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  // Add YouTube video
  const handleVideoAdd = async (e) => {
    e.preventDefault();

    if (!videoForm.url || !videoForm.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      await towerApi.addYoutubeVideo(videoForm);

      toast.success('Video added successfully');

      // Reset form
      setVideoForm({
        url: '',
        title: '',
        description: '',
        category: 'tour',
        order: 0
      });

      fetchTowerData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add video');
    } finally {
      setUploading(false);
    }
  };

  // Delete YouTube video
  const handleVideoDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      await towerApi.deleteYoutubeVideo(videoId);
      toast.success('Video deleted successfully');
      fetchTowerData();
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('images')}
          className={`px-6 py-3 font-bold transition-all ${activeTab === 'images'
            ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          <HiPhotograph className="inline-block mr-2 h-5 w-5" /> {/* FIXED: Changed from HiPhoto */}
          Feature Images ({towerData?.featureImages?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-6 py-3 font-bold transition-all ${activeTab === 'videos'
            ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          <HiVideoCamera className="inline-block mr-2 h-5 w-5" />
          YouTube Videos ({towerData?.youtubeVideos?.length || 0})
        </button>
      </div>

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="space-y-6">
            <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 rounded-xl p-6">
              <div className="flex items-start">
                <HiExclamationCircle className="h-6 w-6 text-primary-600 dark:text-primary-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-primary-900 dark:text-primary-300">
                  <p className="font-bold mb-1">Image Requirements:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Format: JPG, PNG, WebP</li>
                    <li>Max size: 5MB</li>
                    <li>Recommended: 1920x1080px</li>
                    <li>Use high-quality images</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleImageUpload} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Upload Image *
                </label>
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-xl border border-gray-100 dark:border-gray-700 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <HiX className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <HiUpload className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-bold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">PNG, JPG or WebP (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageSelect}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={imageForm.title}
                  onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Grand Lobby View"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={imageForm.description}
                  onChange={(e) => setImageForm({ ...imageForm, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the image"
                />
              </div>

              {/* Category & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={imageForm.category}
                    onChange={(e) => setImageForm({ ...imageForm, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="exterior">Exterior</option>
                    <option value="interior">Interior</option>
                    <option value="lobby">Lobby</option>
                    <option value="amenities">Amenities</option>
                    <option value="offices">Offices</option>
                    <option value="common-areas">Common Areas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={imageForm.order}
                    onChange={(e) => setImageForm({ ...imageForm, order: parseInt(e.target.value) })}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>

              {/* Hero Image */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={imageForm.isHeroImage}
                  onChange={(e) => setImageForm({ ...imageForm, isHeroImage: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Use as Hero Image (shown in homepage carousel)
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading || !imageFile}
                className="w-full btn-primary flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <HiUpload className="mr-2 h-5 w-5" />
                    Upload Image
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Image Gallery */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white pb-2 border-b dark:border-gray-800">Uploaded Images</h3>

            {towerData?.featureImages?.length > 0 ? (
              <div className="space-y-4">
                {towerData.featureImages
                  .sort((a, b) => a.order - b.order)
                  .map((image) => (
                    <motion.div
                      key={image.publicId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="flex">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-32 h-32 object-cover"
                        />
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">{image.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{image.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full">
                                  {image.category}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order: {image.order}</span>
                                {image.isHeroImage && (
                                  <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                    Hero Image
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleImageDelete(image.publicId)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                            >
                              <HiTrash className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <HiPhotograph className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No images uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Video Form */}
          <div className="space-y-6">
            <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 rounded-xl p-6">
              <div className="flex items-start">
                <HiExclamationCircle className="h-6 w-6 text-primary-600 dark:text-primary-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-primary-900 dark:text-primary-300">
                  <p className="font-bold mb-2">YouTube URL Formats:</p>
                  <ul className="list-disc list-inside space-y-1 font-medium">
                    <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
                    <li>https://youtu.be/VIDEO_ID</li>
                    <li>https://www.youtube.com/embed/VIDEO_ID</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleVideoAdd} className="space-y-4">
              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  YouTube URL *
                </label>
                <input
                  type="url"
                  value={videoForm.url}
                  onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Tower 3 Full Walkthrough"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the video"
                />
              </div>

              {/* Category & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="tour">Virtual Tour</option>
                    <option value="testimonial">Testimonial</option>
                    <option value="facilities">Facilities</option>
                    <option value="location">Location</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={videoForm.order}
                    onChange={(e) => setVideoForm({ ...videoForm, order: parseInt(e.target.value) })}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full btn-primary flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="mr-2 h-5 w-5" />
                    Add Video
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Video List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white pb-2 border-b dark:border-gray-800">Added Videos</h3>

            {towerData?.youtubeVideos?.length > 0 ? (
              <div className="space-y-4">
                {towerData.youtubeVideos
                  .sort((a, b) => a.order - b.order)
                  .map((video) => (
                    <motion.div
                      key={video.videoId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="flex">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-32 h-32 object-cover"
                        />
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">{video.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{video.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                                  {video.category}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order: {video.order}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleVideoDelete(video.videoId)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                            >
                              <HiTrash className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <HiVideoCamera className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No videos added yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TowerMediaManager;