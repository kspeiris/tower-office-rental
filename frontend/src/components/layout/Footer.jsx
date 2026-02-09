import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiOfficeBuilding,
  HiPhone,
  HiMail,
  HiLocationMarker,
  HiArrowRight,
  HiGlobe
} from 'react-icons/hi';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram
} from 'react-icons/fa';
import { motion } from 'framer-motion';

// ============================================================================
// FOOTER LINK COMPONENT
// ============================================================================
const FooterLink = ({ to, children, external = false }) => {
  const baseClass = "text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center group outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1 py-0.5";

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={baseClass}>
        {children}
        <HiArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
      </a>
    );
  }

  return (
    <Link to={to} className={baseClass}>
      {children}
    </Link>
  );
};

// ============================================================================
// SOCIAL MEDIA LINK COMPONENT
// ============================================================================
const SocialLink = ({ href, icon: Icon, label }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-lg bg-gray-800 text-gray-400 hover:bg-primary-500 hover:text-white transition-colors duration-200 flex items-center justify-center outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="h-5 w-5" />
    </motion.a>
  );
};

// ============================================================================
// CONTACT INFO ITEM COMPONENT
// ============================================================================
const ContactInfoItem = ({ icon: Icon, text, link = null, type = 'text' }) => {
  const content = (
    <>
      <Icon className="h-5 w-5 text-primary-400 flex-shrink-0" />
      <span className="text-gray-400 group-hover:text-white transition-colors duration-200">
        {text}
      </span>
    </>
  );

  if (link) {
    if (type === 'phone') {
      return (
        <li>
          <a
            href={`tel:${link}`}
            className="flex items-center space-x-3 group outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
          >
            {content}
          </a>
        </li>
      );
    } else if (type === 'email') {
      return (
        <li>
          <a
            href={`mailto:${link}`}
            className="flex items-center space-x-3 group outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
          >
            {content}
          </a>
        </li>
      );
    }
  }

  return (
    <li className="flex items-center space-x-3 text-gray-400">
      {content}
    </li>
  );
};

// ============================================================================
// MAIN FOOTER COMPONENT
// ============================================================================
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/floors', label: 'Available Floors' },
    { to: '/amenities', label: 'Amenities' },
    { to: '/contact', label: 'Contact Us' }
  ];

  const socialLinks = [
    { href: 'https://facebook.com', icon: FaFacebook, label: 'Facebook' },
    { href: 'https://twitter.com', icon: FaTwitter, label: 'Twitter' },
    { href: 'https://linkedin.com', icon: FaLinkedin, label: 'LinkedIn' },
    { href: 'https://instagram.com', icon: FaInstagram, label: 'Instagram' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 group outline-none focus-within:ring-2 focus-within:ring-primary-400 rounded-lg p-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-200"></div>
                <HiOfficeBuilding className="h-8 w-8 text-primary-500 relative z-10" />
              </div>
              <span className="text-2xl font-bold">
                Tower<span className="text-primary-500">Space</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium office spaces in the heart of the city. Experience luxury, convenience, and productivity.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-4">
              {socialLinks.map((social) => (
                <SocialLink
                  key={social.label}
                  href={social.href}
                  icon={social.icon}
                  label={social.label}
                />
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
              <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full mr-3"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
              <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full mr-3"></span>
              Contact Info
            </h3>
            <ul className="space-y-3">
              <ContactInfoItem
                icon={HiLocationMarker}
                text="123 Business District, City Center"
              />
              <ContactInfoItem
                icon={HiPhone}
                text="+1 (555) 123-4567"
                link="+15551234567"
                type="phone"
              />
              <ContactInfoItem
                icon={HiMail}
                text="info@towerspace.com"
                link="info@towerspace.com"
                type="email"
              />
            </ul>
          </motion.div>

          {/* Office Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
              <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full mr-3"></span>
              Office Hours
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center group">
                <span className="text-gray-400 group-hover:text-white transition-colors duration-200">Monday - Friday</span>
                <span className="text-primary-500 font-bold">9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="text-gray-400 group-hover:text-white transition-colors duration-200">Saturday</span>
                <span className="text-primary-500 font-bold">10:00 AM - 4:00 PM</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="text-gray-400 group-hover:text-white transition-colors duration-200">Sunday</span>
                <span className="text-gray-500 font-semibold">Closed</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8 origin-left"
        />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; {currentYear} TowerSpace. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
            <a
              href="#privacy"
              className="text-gray-400 hover:text-white transition-colors duration-200 outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
              onClick={(e) => {
                e.preventDefault();
                // Handle privacy policy
              }}
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-gray-400 hover:text-white transition-colors duration-200 outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
              onClick={(e) => {
                e.preventDefault();
                // Handle terms of service
              }}
            >
              Terms of Service
            </a>
            <a
              href="#sitemap"
              className="text-gray-400 hover:text-white transition-colors duration-200 outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
              onClick={(e) => {
                e.preventDefault();
                // Handle sitemap
              }}
            >
              Sitemap
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;