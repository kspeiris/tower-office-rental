import React from 'react';
import { Link } from 'react-router-dom';
import { HiOfficeBuilding, HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <HiOfficeBuilding className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">
                Tower<span className="text-primary-400">Space</span>
              </span>
            </div>
            <p className="text-gray-400">
              Premium office spaces in the heart of the city. Experience luxury, convenience, and productivity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/floors" className="text-gray-400 hover:text-white transition-colors">
                  Available Floors
                </Link>
              </li>
              <li>
                <Link to="/amenities" className="text-gray-400 hover:text-white transition-colors">
                  Amenities
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <HiLocationMarker className="h-5 w-5 text-primary-400" />
                <span>123 Business District, City Center</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <HiPhone className="h-5 w-5 text-primary-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <HiMail className="h-5 w-5 text-primary-400" />
                <span>info@towerspace.com</span>
              </li>
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Office Hours</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} TowerSpace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;