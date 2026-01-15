import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  HiBuildingOffice, 
  HiCheckCircle, 
  HiArrowRight,
  HiUsers,
  HiChartBar,
  HiShieldCheck
} from 'react-icons/hi';
import { floorApi } from '../../services/api';
import FloorCard from '../../components/public/FloorCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const HomePage = () => {
  const [featuredFloors, setFeaturedFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedFloors();
  }, []);

  const fetchFeaturedFloors = async () => {
    try {
      setLoading(true);
      const response = await floorApi.getFeatured();
      setFeaturedFloors(response.data.floors || []);
    } catch (error) {
      console.error('Error fetching featured floors:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <HiBuildingOffice className="h-8 w-8" />,
      title: 'Premium Spaces',
      description: 'State-of-the-art office spaces designed for productivity and comfort.'
    },
    {
      icon: <HiShieldCheck className="h-8 w-8" />,
      title: '24/7 Security',
      description: 'Advanced security systems and round-the-clock surveillance.'
    },
    {
      icon: <HiUsers className="h-8 w-8" />,
      title: 'Community',
      description: 'Network with industry leaders and innovative companies.'
    },
    {
      icon: <HiChartBar className="h-8 w-8" />,
      title: 'High ROI',
      description: 'Strategic location offering excellent return on investment.'
    }
  ];

  const amenities = [
    'High-speed fiber internet',
    'Conference rooms',
    'Parking facilities',
    '24/7 access',
    'Cleaning services',
    'Fitness center',
    'Cafeteria',
    'Reception services'
  ];

  return (
    <>
      <Helmet>
        <title>TowerSpace | Premium Office Spaces</title>
        <meta name="description" content="Premium office spaces in the heart of the city. Find your perfect workspace at TowerSpace." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Elevate Your <span className="text-yellow-300">Business</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              Premium office spaces in the heart of the city. Experience luxury, convenience, and productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/floors"
                className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center justify-center"
              >
                View Available Spaces
                <HiArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600"
              >
                Schedule a Tour
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TowerSpace?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide more than just office space - we offer an ecosystem designed for success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Floors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Spaces</h2>
              <p className="text-gray-600">Handpicked premium office spaces</p>
            </div>
            <Link
              to="/floors"
              className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center"
            >
              View all spaces
              <HiArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredFloors.map((floor, index) => (
                <motion.div
                  key={floor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <FloorCard floor={floor} />
                </motion.div>
              ))}
            </div>
          )}

          {!loading && featuredFloors.length === 0 && (
            <div className="text-center py-12">
              <HiBuildingOffice className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Spaces Available</h3>
              <p className="text-gray-600">Check back soon for premium office spaces.</p>
            </div>
          )}
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">World-Class Amenities</h2>
              <p className="text-gray-600 mb-8">
                Enjoy a comprehensive suite of amenities designed to support your business needs and enhance your workday experience.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <HiCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready to Move In?</h3>
                  <p className="mb-6">Schedule a personal tour of our premium spaces.</p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Book a Tour
                    <HiArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;