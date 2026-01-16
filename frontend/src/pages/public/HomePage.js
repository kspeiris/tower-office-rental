import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  HiBuildingOffice2, 
  HiCheckCircle, 
  HiArrowRight,
  HiUsers,
  HiChartBar,
  HiShieldCheck,
  HiMapPin,
  HiClock,
  HiWifi,
  HiTrophy,
  HiSparkles,
  HiViewfinderCircle,
  HiPlayCircle,
  HiArrowRightCircle,
  HiChevronLeft,
  HiChevronRight,
  HiHeart,
  HiStar,
  HiBuildingLibrary,
  HiCpuChip,
  HiCloudArrowUp,
  HiHomeModern
} from 'react-icons/hi2';
import { HiPhotograph } from 'react-icons/hi';  // FIXED: Added HiPhotograph from hi
import { floorApi, adminApi, towerApi } from '../../services/api';
import FloorCard from '../../components/public/FloorCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TowerGallery from '../../components/public/TowerGallery';
import VideoShowcase from '../../components/public/VideoShowcase';

const HomePage = () => {
  const [featuredFloors, setFeaturedFloors] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [towerData, setTowerData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % towerImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [floorsResponse, statsResponse, towerResponse] = await Promise.all([
        floorApi.getFeatured(),
        adminApi.getDashboardStats(),
        towerApi.getInfo()
      ]);
      setFeaturedFloors(floorsResponse.data.floors || []);
      setDashboardStats(statsResponse.data);
      setTowerData(towerResponse.data.towerInfo || {});
    } catch (error) {
      console.error('Error fetching data:', error);
      setDashboardStats({
        totalFloors: 25,
        availableFloors: 8,
        occupancyRate: 92,
        totalInquiries: 156
      });
    } finally {
      setLoading(false);
    }
  };

  const towerImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Modern Architecture',
      description: 'Contemporary design with sustainable materials',
      category: 'Exterior'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      title: 'Grand Lobby',
      description: 'Premium marble finishes with elegant lighting',
      category: 'Common Areas'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Executive Suites',
      description: 'Spacious offices with panoramic city views',
      category: 'Interior'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      title: 'Conference Facilities',
      description: 'State-of-the-art meeting rooms',
      category: 'Amenities'
    }
  ];

  const features = [
    {
      icon: <HiBuildingOffice2 className="h-10 w-10" />,
      title: 'Premium Office Spaces',
      description: 'Modern workspaces designed for productivity and innovation.',
      gradient: 'from-blue-600 to-cyan-500',
      stats: '50+ Companies'
    },
    {
      icon: <HiShieldCheck className="h-10 w-10" />,
      title: 'Advanced Security',
      description: '24/7 surveillance with biometric access control.',
      gradient: 'from-emerald-600 to-teal-500',
      stats: '100% Secure'
    },
    {
      icon: <HiCpuChip className="h-10 w-10" />,
      title: 'Smart Technology',
      description: 'IoT-enabled building with energy management systems.',
      gradient: 'from-purple-600 to-pink-500',
      stats: 'AI Integrated'
    },
    {
      icon: <HiHomeModern className="h-10 w-10" />,
      title: 'Sustainable Design',
      description: 'LEED-certified building with green initiatives.',
      gradient: 'from-green-600 to-lime-500',
      stats: 'Eco-Friendly'
    }
  ];

  const towerStats = [
    { 
      label: 'Total Floors', 
      value: dashboardStats?.totalFloors || 25, 
      icon: <HiBuildingLibrary /> 
    },
    { 
      label: 'Occupancy Rate', 
      value: `${dashboardStats?.occupancyRate || 92}%`, 
      icon: <HiChartBar /> 
    },
    { 
      label: 'Available Spaces', 
      value: dashboardStats?.availableFloors || 8, 
      icon: <HiHomeModern /> 
    },
    { 
      label: 'Tenant Companies', 
      value: '50+', 
      icon: <HiUsers /> 
    }
  ];

  const amenities = [
    { icon: <HiWifi />, label: 'High-speed Fiber Internet', detail: '10 Gbps connectivity' },
    { icon: <HiClock />, label: '24/7 Access', detail: 'Flexible working hours' },
    { icon: <HiTrophy />, label: 'Executive Lounge', detail: 'Premium networking space' },
    { icon: <HiCloudArrowUp />, label: 'Cloud Services', detail: 'Enterprise-grade IT support' },
    { icon: <HiSparkles />, label: 'Cleaning Services', detail: 'Daily professional cleaning' },
    { icon: <HiViewfinderCircle />, label: 'Virtual Tours', detail: '3D immersive experiences' }
  ];

  return (
    <>
      <Helmet>
        <title>JFI Tower 3 | Premium Commercial Office Spaces</title>
        <meta name="description" content="JFI Tower 3 offers premium Grade A office spaces with world-class amenities in the heart of the business district. Experience luxury, innovation, and productivity." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div className="relative w-full h-full">
                <img
                  src={towerImages[activeImage].url}
                  alt={towerImages[activeImage].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <HiStar className="h-4 w-4 text-yellow-300 mr-2" />
              <span className="text-sm font-medium">Premium Grade A Building</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-cyan-300">JFI Tower 3</span>
              <br />
              Where Innovation
              <br />
              Meets <span className="text-yellow-300">Excellence</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mb-8">
              A landmark commercial tower offering premium office spaces with cutting-edge 
              amenities in the heart of the business district.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/floors')}
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl shadow-blue-500/25 flex items-center justify-center"
              >
                <span>Explore Available Spaces</span>
                <HiArrowRightCircle className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <span className="flex items-center">
                  <HiMapPin className="mr-3 h-6 w-6" />
                  Schedule Tour
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tower Stats */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {towerStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 mb-4">
              <HiSparkles className="h-4 w-4 mr-2" />
              <span className="text-sm font-semibold">WHY CHOOSE US</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Unmatched <span className="text-blue-600">Premium</span> Experience
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              JFI Tower 3 redefines commercial excellence with state-of-the-art facilities 
              and innovative workspaces designed for the modern enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300"></div>
                <div className="relative p-8 rounded-3xl border border-gray-200 bg-white">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-2">{feature.title}</div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="text-sm font-semibold text-blue-600">{feature.stats}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Floors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 mb-4">
                <HiStar className="h-4 w-4 mr-2" />
                <span className="text-sm font-semibold">FEATURED SPACES</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Premium <span className="text-blue-600">Available</span> Spaces
              </h2>
              <p className="text-gray-600">Exclusive office spaces with prime locations and premium finishes</p>
            </div>
            <Link
              to="/floors"
              className="group mt-4 md:mt-0 inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View all available spaces
              <HiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : featuredFloors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredFloors.map((floor, index) => (
                <motion.div
                  key={floor._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <FloorCard floor={floor} premium={true} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <HiBuildingOffice2 className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Featured Spaces Available</h3>
              <p className="text-gray-600 mb-6">Premium spaces are currently being prepared.</p>
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Notified First
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <HiTrophy className="h-4 w-4 text-yellow-300 mr-2" />
                <span className="text-sm font-medium">WORLD-CLASS AMENITIES</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Experience the <span className="text-cyan-300">Future</span> of Work
              </h2>
              
              <p className="text-gray-300 text-lg mb-8">
                Our comprehensive suite of amenities is designed to elevate productivity, 
                foster collaboration, and enhance the work-life balance of every occupant.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-4">
                      {amenity.icon}
                    </div>
                    <div>
                      <div className="font-semibold">{amenity.label}</div>
                      <div className="text-sm text-gray-400">{amenity.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={towerImages[2].url}
                  alt="Executive Suite"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-2">Ready to Elevate Your Business?</h3>
                    <p className="text-gray-200 mb-6">Schedule a personalized tour and experience JFI Tower 3 firsthand.</p>
                    <button
                      onClick={() => navigate('/contact')}
                      className="group inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Book Exclusive Tour
                      <HiArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tower Gallery Section */}
      {towerData?.featureImages?.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 mb-4">
                <HiPhotograph className="h-4 w-4 mr-2" /> {/* FIXED: Changed from HiPhoto to HiPhotograph */}
                <span className="text-sm font-semibold">TOWER GALLERY</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Explore Our <span className="text-blue-600">Premium</span> Spaces
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Take a visual tour through our state-of-the-art facilities and modern workspaces
              </p>
            </div>

            <TowerGallery images={towerData.featureImages} />
          </div>
        </section>
      )}

      {/* Video Showcase Section */}
      {towerData?.youtubeVideos?.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 text-red-700 mb-4">
                <HiPlayCircle className="h-4 w-4 mr-2" />
                <span className="text-sm font-semibold">VIDEO TOURS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Experience the <span className="text-blue-600">Virtual</span> Tour
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Watch our comprehensive video tours and see what makes JFI Tower 3 exceptional
              </p>
            </div>

            <VideoShowcase videos={towerData.youtubeVideos} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join the <span className="text-blue-600">Elite</span> Community
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Be part of a curated ecosystem of industry leaders, innovators, 
              and forward-thinking companies at JFI Tower 3.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-1 shadow-xl flex items-center justify-center"
              >
                Request Proposal
                <HiArrowRightCircle className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
              >
                Schedule a Tour
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;