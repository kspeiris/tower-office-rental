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
import { HiPhotograph, HiCalendar } from 'react-icons/hi';
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
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // Define all constants FIRST
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
      gradient: 'from-primary-600 to-teal-500',
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
      gradient: 'from-teal-600 to-cyan-500',
      stats: 'AI Integrated'
    },
    {
      icon: <HiHomeModern className="h-10 w-10" />,
      title: 'Sustainable Design',
      description: 'LEED-certified building with green initiatives.',
      gradient: 'from-emerald-600 to-teal-600',
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

  // Derive dynamic images
  const dynamicHeroImages = towerData?.featureImages?.filter(img => img.isHeroImage) || [];
  const currentHeroImages = dynamicHeroImages.length > 0 ? dynamicHeroImages : towerImages;

  // Find specific amenities image (one with category 'amenities' and highest order/isHeroImage)
  const amenitiesImage = towerData?.featureImages?.find(img => img.category === 'amenities') || towerImages[3];

  // useEffect hooks
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isCarouselPaused && currentHeroImages.length > 0) {
      const interval = setInterval(() => {
        setActiveImage((prev) => (prev + 1) % currentHeroImages.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isCarouselPaused, currentHeroImages.length]);

  // Functions
  const fetchData = async () => {
    try {
      setLoading(true);
      const [floorsResponse, statsResponse, towerResponse] = await Promise.all([
        floorApi.getFeatured(),
        towerApi.getPublicStats(),
        towerApi.getInfo()
      ]);
      setFeaturedFloors(floorsResponse.data.floors || []);
      setDashboardStats(statsResponse.data);

      const towerInfo = towerResponse.data.towerInfo || {};
      setTowerData(towerInfo);
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

  const nextSlide = () => {
    setActiveImage((prev) => (prev + 1) % currentHeroImages.length);
  };

  const prevSlide = () => {
    setActiveImage((prev) => (prev - 1 + currentHeroImages.length) % currentHeroImages.length);
  };

  const handleCarouselKeyboard = (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsCarouselPaused(!isCarouselPaused);
    }
  };

  return (
    <>
      <Helmet>
        <title>JFI Tower 3 | Premium Commercial Office Spaces</title>
        <meta name="description" content="JFI Tower 3 offers premium Grade A office spaces with world-class amenities in the heart of the business district. Experience luxury, innovation, and productivity." />
      </Helmet>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        onKeyDown={handleCarouselKeyboard}
        tabIndex={0}
        role="region"
        aria-label="Hero carousel"
        aria-live="polite"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
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
                  src={currentHeroImages[activeImage]?.url}
                  alt={`${currentHeroImages[activeImage]?.title || 'Tower'} - ${currentHeroImages[activeImage]?.description || ''}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-4">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous image"
            >
              <HiChevronLeft className="h-6 w-6 text-white" aria-hidden="true" />
            </button>

            <div className="flex space-x-2">
              {currentHeroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${index === activeImage ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                    }`}
                  aria-label={`View slide ${index + 1}`}
                  aria-current={index === activeImage ? 'true' : 'false'}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next image"
            >
              <HiChevronRight className="h-6 w-6 text-white" aria-hidden="true" />
            </button>

            <button
              onClick={() => setIsCarouselPaused(!isCarouselPaused)}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={isCarouselPaused ? 'Play carousel' : 'Pause carousel'}
            >
              {isCarouselPaused ? (
                <HiPlayCircle className="h-6 w-6 text-white" aria-hidden="true" />
              ) : (
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-center md:text-left"
          >
            <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-xl border border-emerald-400/30 mb-8 md:mb-14 shadow-[0_0_40px_rgba(16,185,129,0.2)] group cursor-default">
              <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2 mr-3 md:mr-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-emerald-400"></span>
              </span>
              <span className="text-[9px] md:text-xs font-black tracking-[0.3em] md:tracking-[0.4em] uppercase text-emerald-100 whitespace-nowrap">Grade-A Corporate Headquarters</span>
            </div>

            <h1 className="font-['Outfit'] text-4xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black mb-8 md:mb-12 leading-[0.9] md:leading-[0.85] tracking-tighter">
              <span className="block mb-4 md:mb-6 text-white filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] md:drop-shadow-[0_24px_36px_rgba(0,0,0,0.95)]">
                {towerData?.landingPage?.hero?.title || 'JFI Tower 3'}
              </span>

              {towerData?.landingPage?.hero?.subtitle?.includes(' Meets ') ? (
                <div className="flex flex-col space-y-2 md:space-y-4">
                  <div className="flex items-center space-x-4 md:space-x-10">
                    <span className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-400 leading-tight filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
                      {towerData.landingPage.hero.subtitle.split(' Meets ')[0]}
                    </span>
                    <span className="text-sm md:text-xl font-light text-emerald-200/40 italic tracking-[0.2em] md:tracking-[0.3em] uppercase hidden sm:block">Meets</span>
                  </div>
                  <span className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white decoration-emerald-400 underline underline-offset-[12px] md:underline-offset-[20px] decoration-[3px] md:decoration-[6px] drop-shadow-[0_12px_16px_rgba(0,0,0,0.7)]">
                    {towerData.landingPage.hero.subtitle.split(' Meets ')[1]}
                  </span>
                </div>
              ) : (
                <span className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-400 leading-tight drop-shadow-[0_12px_16px_rgba(0,0,0,0.6)]">
                  {towerData?.landingPage?.hero?.subtitle || 'Where Innovation Meets Excellence'}
                </span>
              )}
            </h1>

            <div className="max-w-4xl mb-10 md:mb-14">
              <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-gray-100 leading-relaxed font-medium md:font-semibold filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] border-l-2 md:border-l-4 border-emerald-400 pl-4 md:pl-10 bg-gradient-to-r from-black/30 to-transparent py-2 backdrop-blur-sm">
                {towerData?.landingPage?.hero?.description || 'A landmark commercial tower offering premium office spaces with cutting-edge amenities in the heart of the business district.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-stretch md:items-center">
              <button
                onClick={() => navigate('/floors')}
                className="group relative px-6 md:px-10 py-4 md:py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm md:text-base font-black rounded-xl md:rounded-2xl transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 hover:scale-[1.02] active:scale-[0.98] shadow-[0_15px_35px_rgba(16,185,129,0.5)] hover:shadow-[0_20px_45px_rgba(16,185,129,0.6)] flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10">EXPLORE AVAILABLE SPACES</span>
                <HiArrowRightCircle className="relative z-10 ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6 transform group-hover:translate-x-2 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/contact')}
                className="px-6 md:px-10 py-4 md:py-5 bg-white/5 backdrop-blur-xl border-2 border-emerald-400/40 text-white text-sm md:text-base font-black rounded-xl md:rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-400/60 transition-all duration-300 active:scale-[0.98] shadow-[0_8px_20px_rgba(16,185,129,0.15)] hover:shadow-[0_12px_30px_rgba(16,185,129,0.25)] flex items-center justify-center"
              >
                <HiCalendar className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 text-emerald-300" />
                BOOK A PRIVATE TOUR
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tower Stats */}
      <section className="py-12 md:py-16 bg-gray-900 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {towerStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center p-6 md:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] hover:bg-white/[0.05] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-teal-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20" aria-hidden="true">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-teal-100 dark:from-primary-900/20 dark:to-teal-900/20 text-primary-700 dark:text-primary-300 mb-4">
              <HiSparkles className="h-4 w-4 mr-2" />
              <span className="text-sm font-semibold">WHY CHOOSE US</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Unmatched <span className="text-primary-600 dark:text-primary-400">Premium</span> Experience
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
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
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300"></div>
                <div className="relative p-8 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm group-hover:shadow-xl transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
                    {feature.icon}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                  <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">{feature.stats}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Floors */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 mb-4">
                <HiStar className="h-4 w-4 mr-2" />
                <span className="text-sm font-semibold">FEATURED SPACES</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Premium <span className="text-primary-600 dark:text-primary-400">Available</span> Spaces
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Exclusive office spaces with prime locations and premium finishes</p>
            </div>
            <Link
              to="/floors"
              className="group mt-4 md:mt-0 inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
            >
              View all available spaces
              <HiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
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
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Get Notified First
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <HiTrophy className="h-4 w-4 text-yellow-300 mr-2" />
                <span className="text-sm font-medium">
                  {towerData?.landingPage?.amenities?.tagline || 'WORLD-CLASS AMENITIES'}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {towerData?.landingPage?.amenities?.title?.includes(' Future ') ? (
                  <>
                    {towerData.landingPage.amenities.title.split(' Future ')[0]}
                    <span className="text-primary-300"> Future </span>
                    {towerData.landingPage.amenities.title.split(' Future ')[1]}
                  </>
                ) : (
                  towerData?.landingPage?.amenities?.title || 'Experience the Future of Work'
                )}
              </h2>

              <p className="text-gray-300 text-lg mb-8">
                {towerData?.landingPage?.amenities?.description || 'Our comprehensive suite of amenities is designed to elevate productivity, foster collaboration, and enhance the work-life balance of every occupant.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-teal-500 flex items-center justify-center mr-4">
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
                  src={amenitiesImage?.url}
                  alt={amenitiesImage?.title || 'Executive Suite'}
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
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-teal-100 dark:from-primary-900/20 dark:to-teal-900/20 text-primary-700 dark:text-primary-300 mb-4">
                <HiPhotograph className="h-4 w-4 mr-2" /> {/* FIXED: Changed from HiPhoto to HiPhotograph */}
                <span className="text-sm font-semibold">TOWER GALLERY</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Explore Our <span className="text-primary-600 dark:text-primary-400">Premium</span> Spaces
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
                Take a visual tour through our state-of-the-art facilities and modern workspaces
              </p>
            </div>

            <TowerGallery images={towerData.featureImages} />
          </div>
        </section>
      )}

      {/* Video Showcase Section */}
      {towerData?.youtubeVideos?.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-teal-100 dark:from-primary-900/20 dark:to-teal-900/20 text-primary-700 dark:text-primary-300 mb-4">
                <HiPlayCircle className="h-4 w-4 mr-2" />
                <span className="text-sm font-semibold">VIDEO TOURS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Experience the <span className="text-primary-600 dark:text-primary-400">Virtual</span> Tour
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
                Watch our comprehensive video tours and see what makes JFI Tower 3 exceptional
              </p>
            </div>

            <VideoShowcase videos={towerData.youtubeVideos} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Join the <span className="text-primary-600 dark:text-primary-400">Elite</span> Community
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Be part of a curated ecosystem of industry leaders, innovators,
              and forward-thinking companies at JFI Tower 3.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/floors')}
                className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-teal-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-1 shadow-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                View Available Spaces
                <HiArrowRightCircle className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-semibold rounded-xl border-2 border-primary-200 dark:border-primary-900/50 hover:border-primary-300 dark:hover:border-primary-800 hover:bg-primary-50 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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