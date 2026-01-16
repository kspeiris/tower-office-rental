import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiClock,
  HiCheckCircle
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    newsletter: false
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[\d\s\-\+\(\)]+$/, 'Phone number is not valid'),
    subject: Yup.string()
      .required('Subject is required')
      .min(3, 'Subject must be at least 3 characters'),
    message: Yup.string()
      .required('Message is required')
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message must be less than 1000 characters')
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      
      // In a real app, this would call an API endpoint
      console.log('Contact form submitted:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully! We will contact you soon.');
      resetForm();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <HiLocationMarker className="h-6 w-6" />,
      title: 'Visit Us',
      details: ['123 Business District', 'City Center, Metropolis 10001', 'United States']
    },
    {
      icon: <HiPhone className="h-6 w-6" />,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543']
    },
    {
      icon: <HiMail className="h-6 w-6" />,
      title: 'Email Us',
      details: ['info@towerspace.com', 'leasing@towerspace.com']
    },
    {
      icon: <HiClock className="h-6 w-6" />,
      title: 'Office Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM', 'Sunday: Closed']
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | TowerSpace</title>
        <meta name="description" content="Get in touch with TowerSpace leasing team for inquiries and property tours." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Get in touch with our leasing team. We're here to help you find the perfect space.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center" aria-hidden="true">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    {item.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 bg-gray-100 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Our Location</h3>
              <a 
                href="https://maps.google.com/?q=123+Business+District+City+Center+Metropolis+10001"
                target="_blank"
                rel="noopener noreferrer"
                className="block h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center hover:from-gray-300 hover:to-gray-400 transition-colors group"
                aria-label="View location on Google Maps"
              >
                <HiLocationMarker className="h-12 w-12 text-gray-400 group-hover:text-gray-500 transition-colors" />
              </a>
              <p className="text-sm text-gray-600 mt-4 text-center">
                123 Business District, City Center, Metropolis 10001
              </p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          className="input-field"
                          placeholder="John Doe"
                          aria-required="true"
                          aria-describedby="name-error"
                        />
                        <ErrorMessage name="name" component="div" id="name-error" className="mt-1 text-sm text-red-600" role="alert" />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className="input-field"
                          placeholder="john@example.com"
                          aria-required="true"
                          aria-describedby="email-error"
                        />
                        <ErrorMessage name="email" component="div" id="email-error" className="mt-1 text-sm text-red-600" role="alert" />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <Field
                          type="tel"
                          id="phone"
                          name="phone"
                          className="input-field"
                          placeholder="+1 (555) 123-4567"
                          aria-required="true"
                          aria-describedby="phone-error"
                        />
                        <ErrorMessage name="phone" component="div" id="phone-error" className="mt-1 text-sm text-red-600" role="alert" />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject *
                        </label>
                        <Field
                          type="text"
                          id="subject"
                          name="subject"
                          className="input-field"
                          placeholder="General Inquiry"
                          aria-required="true"
                          aria-describedby="subject-error"
                        />
                        <ErrorMessage name="subject" component="div" id="subject-error" className="mt-1 text-sm text-red-600" role="alert" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <Field
                        as="textarea"
                        id="message"
                        name="message"
                        rows="6"
                        className="input-field"
                        placeholder="Tell us about your requirements..."
                        aria-required="true"
                        aria-describedby="message-error"
                      />
                      <ErrorMessage name="message" component="div" id="message-error" className="mt-1 text-sm text-red-600" role="alert" />
                    </div>

                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        id="newsletter"
                        name="newsletter"
                        className="h-4 w-4 text-primary-600 rounded"
                      />
                      <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
                        Subscribe to our newsletter for updates and offers
                      </label>
                    </div>

                    <div className="pt-6 border-t">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        aria-busy={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          'Send Message'
                        )}
                      </button>
                      <p className="mt-3 text-sm text-gray-600 text-center">
                        We'll respond to your message within 24 hours.
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 card p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              
              <div className="space-y-6">
                {[
                  {
                    q: 'How do I schedule a property tour?',
                    a: 'You can schedule a tour by submitting an inquiry for a specific floor or contacting our leasing team directly.'
                  },
                  {
                    q: 'What are the standard lease terms?',
                    a: 'We offer flexible lease terms ranging from 1-5 years, with options for renewal.'
                  },
                  {
                    q: 'Are utilities included in the rent?',
                    a: 'Basic utilities are included. Additional services may be billed separately.'
                  },
                  {
                    q: 'Is parking available?',
                    a: 'Yes, we offer both covered and uncovered parking options for tenants.'
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <HiCheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                        <p className="text-gray-600">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;