import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  HiWifi,
  HiShieldCheck,
  HiTruck,
  HiFire, // Changed from HiCoffee
  HiDesktopComputer,
  HiPhone,
  HiLockClosed,
  HiUsers,
  HiOfficeBuilding
} from 'react-icons/hi';

const AmenitiesPage = () => {
  const amenities = [
    {
      icon: <HiWifi className="h-8 w-8" />,
      title: 'High-Speed Internet',
      description: 'Enterprise-grade fiber optic internet with dedicated bandwidth for uninterrupted connectivity.',
      category: 'Technology'
    },
    {
      icon: <HiShieldCheck className="h-8 w-8" />,
      title: '24/7 Security',
      description: 'Round-the-clock security personnel, CCTV surveillance, and biometric access control.',
      category: 'Security'
    },
    {
      icon: <HiTruck className="h-8 w-8" />,
      title: 'Valet Parking',
      description: 'Complimentary valet parking services for tenants and their guests.',
      category: 'Convenience'
    },
    {
      icon: <HiFire className="h-8 w-8" />, // Changed icon
      title: 'Executive Lounge',
      description: 'Premium lounge area with complimentary coffee, tea, and refreshments.',
      category: 'Hospitality'
    },
    {
      icon: <HiFire className="h-8 w-8" />,
      title: 'Fitness Center',
      description: 'State-of-the-art gym with personal trainers, yoga studio, and locker rooms.',
      category: 'Wellness'
    },
    {
      icon: <HiDesktopComputer className="h-8 w-8" />,
      title: 'Conference Facilities',
      description: 'Multiple meeting rooms, boardrooms, and presentation facilities with AV equipment.',
      category: 'Business'
    },
    {
      icon: <HiPhone className="h-8 w-8" />,
      title: 'Reception Services',
      description: 'Professional reception staff to handle calls, mail, and guest services.',
      category: 'Services'
    },
    {
      icon: <HiLockClosed className="h-8 w-8" />,
      title: 'Secure Storage',
      description: 'Private, secure storage facilities and safe deposit boxes available.',
      category: 'Security'
    },
    {
      icon: <HiUsers className="h-8 w-8" />,
      title: 'Networking Events',
      description: 'Regular business networking events and community gatherings.',
      category: 'Community'
    },
    {
      icon: <HiOfficeBuilding className="h-8 w-8" />,
      title: 'Business Center',
      description: 'Fully equipped business center with printing, scanning, and mailing services.',
      category: 'Business'
    }
  ];

  const categories = ['All', 'Technology', 'Security', 'Convenience', 'Hospitality', 'Wellness', 'Business', 'Services', 'Community'];

  return (
    <>
      <Helmet>
        <title>Amenities & Facilities | TowerSpace</title>
        <meta name="description" content="Discover world-class amenities and facilities at TowerSpace premium office tower." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">World-Class Amenities</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Experience premium facilities designed to enhance productivity, wellness, and business success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-4 py-2 rounded-full border border-gray-300 hover:border-primary-600 hover:text-primary-600 transition-colors"
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card p-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-100 text-primary-600 mb-6">
                  {amenity.icon}
                </div>
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {amenity.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{amenity.title}</h3>
                <p className="text-gray-600">{amenity.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sustainable & Smart Building</h2>
              <p className="text-gray-600 mb-6">
                TowerSpace is committed to sustainability and innovation. Our building features state-of-the-art systems designed for efficiency and comfort.
              </p>
              <ul className="space-y-4">
                {[
                  'LEED Platinum Certified building',
                  'Energy-efficient HVAC systems',
                  'Smart lighting with motion sensors',
                  'Water conservation systems',
                  'EV charging stations',
                  'Green roof and solar panels'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Experience Premium Amenities</h3>
              <p className="mb-6">
                Schedule a tour to experience our world-class amenities firsthand and see how TowerSpace can elevate your business.
              </p>
              <button className="w-full px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Schedule a Tour
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AmenitiesPage;