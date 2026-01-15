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
  HiHomeModern,
  HiXMark,
  HiArrowsPointingOut,
  HiComputerDesktop,
  HiDevicePhoneMobile,
  HiPause,
  HiForward,
  HiBackward
} from 'react-icons/hi2';
import { floorApi, adminApi } from '../../services/api';
import FloorCard from '../../components/public/FloorCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Virtual Tour Modal Component
const VirtualTourModal = ({ isOpen, onClose }) => {
  const [tourStep, setTourStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const tourSteps = [
    {
      title: "Grand Lobby",
      description: "Experience our luxurious entrance with premium finishes",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual 360° video
      imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
    },
    {
      title: "Executive Suites",
      description: "Explore our premium office spaces with panoramic views",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual 360° video
      imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Conference Facilities",
      description: "Discover our state-of-the-art meeting rooms",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual 360° video
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
    },
    {
      title: "Amenities Floor",
      description: "Tour our fitness center, cafeteria, and lounge areas",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual 360° video
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  const nextStep = () => {
    setTourStep((prev) => (prev + 1) % tourSteps.length);
  };

  const prevStep = () => {
    setTourStep((prev) => (prev - 1 + tourSteps.length) % tourSteps.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative w-full max-w-6xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">
                JFI Tower 3 Virtual Tour
              </h2>
              <p className="text-gray-400">Experience our premium spaces in 360°</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <HiXMark className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Tour Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Tour Display */}
              <div className="lg:col-span-2">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
                  {/* Video/360° Viewer */}
                  {isPlaying ? (
                    <iframe
                      src={tourSteps[tourStep].videoUrl}
                      title="Virtual Tour"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={tourSteps[tourStep].imageUrl}
                        alt={tourSteps[tourStep].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                        <div>
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
                            <span className="text-sm text-white">360° View Available</span>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">{tourSteps[tourStep].title}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                    <button
                      onClick={prevStep}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <HiBackward className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      {isPlaying ? (
                        <HiPause className="h-5 w-5 text-white" />
                      ) : (
                        <HiPlayCircle className="h-5 w-5 text-white" />
                      )}
                    </button>
                    <button
                      onClick={nextStep}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <HiForward className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
                
                {/* Tour Navigation */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={prevStep}
                    className="flex items-center text-white hover:text-cyan-300 transition-colors"
                  >
                    <HiChevronLeft className="h-5 w-5 mr-2" />
                    Previous
                  </button>
                  
                  <div className="flex space-x-2">
                    {tourSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setTourStep(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === tourStep 
                            ? 'bg-cyan-400' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextStep}
                    className="flex items-center text-white hover:text-cyan-300 transition-colors"
                  >
                    Next
                    <HiChevronRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>

              {/* Tour Info Panel */}
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Tour Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-300">
                      <HiCheckCircle className="h-5 w-5 text-cyan-400 mr-3" />
                      <span>360° Interactive Views</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <HiCheckCircle className="h-5 w-5 text-cyan-400 mr-3" />
                      <span>HD Quality Streaming</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <HiCheckCircle className="h-5 w-5 text-cyan-400 mr-3" />
                      <span>Floor-by-Floor Exploration</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <HiCheckCircle className="h-5 w-5 text-cyan-400 mr-3" />
                      <span>Mobile & Desktop Compatible</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Current Location</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-white mb-2">
                        {tourSteps[tourStep].title}
                      </div>
                      <p className="text-gray-300">
                        {tourSteps[tourStep].description}
                      </p>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <HiMapPin className="h-5 w-5 mr-2" />
                      <span>Floor {tourStep + 1} • JFI Tower 3</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
                  <h3 className="text-xl font-bold text-white mb-4">Want to See More?</h3>
                  <p className="text-gray-300 mb-4">
                    Schedule a personalized in-person tour for the full experience.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      window.location.href = '/contact';
                    }}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all"
                  >
                    Schedule In-Person Tour
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-400">
                  <HiComputerDesktop className="h-5 w-5 mr-2" />
                  <span>Desktop Compatible</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <HiDevicePhoneMobile className="h-5 w-5 mr-2" />
                  <span>Mobile Optimized</span>
                </div>
              </div>
              <button
                onClick={() => {
                  const iframe = document.querySelector('iframe');
                  if (iframe) {
                    iframe.requestFullscreen();
                  }
                }}
                className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <HiArrowsPointingOut className="h-5 w-5 mr-2" />
                Fullscreen
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const HomePage = () => {
  const [featuredFloors, setFeaturedFloors] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);
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
      const [floorsResponse, statsResponse] = await Promise.all([
        floorApi.getFeatured(),
        adminApi.getDashboardStats()
      ]);
      setFeaturedFloors(floorsResponse.data.floors || []);
      setDashboardStats(statsResponse.data);
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

      {/* Virtual Tour Modal */}
      <VirtualTourModal 
        isOpen={isVirtualTourOpen} 
        onClose={() => setIsVirtualTourOpen(false)} 
      />

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
              
              {/* UPDATED: Virtual Tour Button now opens the modal */}
              <button
                onClick={() => setIsVirtualTourOpen(true)}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <span className="flex items-center">
                  <HiPlayCircle className="mr-3 h-6 w-6" />
                  Virtual Tour
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rest of the HomePage remains the same... */}
      {/* Tower Stats, Features, Featured Floors, Amenities, CTA sections */}
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
                onClick={() => setIsVirtualTourOpen(true)}
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
              >
                Experience Virtual Tour
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;