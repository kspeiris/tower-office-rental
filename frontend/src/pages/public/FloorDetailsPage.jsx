import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  HiArrowLeft,
  HiCheckCircle,
  HiLocationMarker,
  HiArrowsExpand,
  HiUserGroup,
  HiCalendar,
  HiPhone,
  HiMail,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi';
import { floorApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const FloorDetailsPage = () => {
  const { id } = useParams();
  const [floor, setFloor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    fetchFloorDetails();
    // Reset image index when floor changes
    setCurrentImageIndex(0);
  }, [id]);

  const fetchFloorDetails = async () => {
    try {
      setLoading(true);
      const response = await floorApi.getById(id);
      setFloor(response.data.floor);
    } catch (error) {
      toast.error('Failed to load floor details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (floor.images && floor.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % floor.images.length);
    }
  };

  const prevImage = () => {
    if (floor.images && floor.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + floor.images.length) % floor.images.length);
    }
  };
  const handleKeyboardNavigation = (e) => {
    if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!floor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Floor not found</h2>
          <Link to="/floors" className="text-primary-600 hover:text-primary-700">
            Browse available spaces →
          </Link>
        </div>
      </div>
    );
  }

  const amenitiesList = {
    high_speed_internet: 'High-speed fiber internet',
    conference_rooms: 'Conference rooms',
    parking: 'Parking facilities',
    security: '24/7 security',
    cafeteria: 'Cafeteria',
    gym: 'Fitness center',
    elevator: 'Elevator access',
    air_conditioning: 'Air conditioning',
    cleaning_services: 'Cleaning services',
    reception: 'Reception services'
  };

  return (
    <>
      <Helmet>
        <title>
          {floor ? `${floor.name} | Floor ${floor.floorNumber} | TowerSpace` : 'Floor Details | TowerSpace'}
        </title>
        <meta name="description" content={floor?.description || 'Office space details'} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        {/* Back Navigation */}
        <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              to="/floors"
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1 transition-colors"
            >
              <HiArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
              Back to all spaces
            </Link>
          </div>
        </div>

        {/* Image Gallery Section */}
        {floor.images && floor.images.length > 0 && (
          <div className="relative bg-black" onKeyDown={handleKeyboardNavigation} tabIndex={-1}>
            <div className="max-w-7xl mx-auto">
              <div className="relative h-96 md:h-[500px]">
                <img
                  src={floor.images[currentImageIndex]}
                  alt={`${floor.name} - View ${currentImageIndex + 1} of ${floor.images.length}`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />

                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <p className="text-gray-600">Image failed to load</p>
                  </div>
                )}

                {floor.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
                      aria-label="Previous image"
                    >
                      <HiChevronLeft className="h-6 w-6 text-gray-800" aria-hidden="true" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
                      aria-label="Next image"
                    >
                      <HiChevronRight className="h-6 w-6 text-gray-800" aria-hidden="true" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2" role="tablist" aria-label="Image navigation">
                      {floor.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${index === currentImageIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/75'
                            }`}
                          role="tab"
                          aria-label={`View image ${index + 1}`}
                          aria-selected={index === currentImageIndex}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {floor.images.length > 1 && (
                <div className="bg-gray-900 py-4">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                      {floor.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-white ${index === currentImageIndex
                            ? 'border-white'
                            : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          aria-label={`View image ${index + 1}`}
                          aria-pressed={index === currentImageIndex}
                        >
                          <img
                            src={image}
                            alt={`${floor.name} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Floor {floor.floorNumber}</h1>
                  <h2 className="text-2xl font-semibold text-gray-200 mb-4">{floor.name}</h2>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <HiCheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                      <span className="text-lg">{floor.status === 'available' ? 'Available Now' : 'Not Available'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HiArrowsExpand className="h-5 w-5" aria-hidden="true" />
                      <span className="text-lg">{floor.area?.toLocaleString() || 'N/A'} sq ft</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HiUserGroup className="h-5 w-5" aria-hidden="true" />
                      <span className="text-lg">Max {floor.maxCapacity || 'N/A'} people</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2 text-yellow-300">{floor.formattedPrice || 'Contact for pricing'}</div>
                    <div className="text-gray-200 mb-4">
                      {floor.pricePerSqFt ? `LKR ${floor.pricePerSqFt}/sq ft` : ''}
                      {floor.pricePerSqFt && floor.pricePerMonth ? ' • ' : ''}
                      {floor.pricePerMonth ? `LKR ${floor.pricePerMonth.toLocaleString()}/month` : ''}
                    </div>
                    {floor.status === 'available' ? (
                      <Link
                        to={`/inquiry/${floor._id}`}
                        className="inline-block w-full px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Schedule a Tour
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
                      >
                        Currently Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="card p-8 mb-8"
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{floor.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <HiCalendar className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                      <span className="font-medium text-gray-900 dark:text-white">Lease Term:</span>
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{floor.leaseTerm}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HiLocationMarker className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                      <span className="font-medium text-gray-900 dark:text-white">View:</span>
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{floor.view} View</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Pricing Details</h4>
                    <div className="space-y-1 text-gray-600 dark:text-gray-400">
                      <div>Area: {floor.area.toLocaleString()} sq ft</div>
                      <div>Price per sq ft: LKR {floor.pricePerSqFt}</div>
                      <div>Annual price: {floor.formattedPrice}</div>
                      <div>Monthly equivalent: LKR {floor.pricePerMonth?.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Amenities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {floor.amenities?.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <HiCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" aria-hidden="true" />
                        <span className="text-gray-700 dark:text-gray-300">{amenitiesList[amenity] || amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Inquiry Form Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card p-8"
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Interested in this space?</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Fill out our inquiry form to schedule a personal tour or get more information about this floor.
                </p>
                <Link
                  to={`/inquiry/${floor._id}`}
                  className="btn-primary inline-flex items-center"
                >
                  Submit Inquiry
                  <HiArrowLeft className="ml-2 h-5 w-5 transform rotate-180" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6"
              >
                {/* Contact Info */}
                <div className="card p-6">
                  <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Contact Information</h4>
                  <div className="space-y-3">
                    <a
                      href="tel:+15551234567"
                      className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <HiPhone className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                      <span>+1 (555) 123-4567</span>
                    </a>
                    <a
                      href="mailto:leasing@towerspace.com"
                      className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <HiMail className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                      <span>leasing@towerspace.com</span>
                    </a>
                  </div>
                </div>

                {/* Floor Specifications */}
                <div className="card p-6">
                  <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Specifications</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Floor Number</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{floor.floorNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <span className="font-semibold text-gray-900 dark:text-white capitalize">{floor.status.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Featured</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{floor.isFeatured ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {/* Similar Spaces */}
                <div className="card p-6">
                  <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Similar Spaces</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Looking for something different? Browse our other available spaces.
                  </p>
                  <Link
                    to="/floors"
                    className="btn-secondary w-full text-center transition-all"
                  >
                    View All Spaces
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloorDetailsPage;