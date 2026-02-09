import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  HiArrowLeft,
  HiOfficeBuilding, // Changed from HiBuildingOffice
  HiCalendar,
  HiCurrencyDollar
} from 'react-icons/hi';
import { floorApi, inquiryApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const InquiryFormPage = () => {
  const { floorId } = useParams();
  const navigate = useNavigate();
  const [floor, setFloor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFloorDetails();
  }, [floorId]);

  const fetchFloorDetails = async () => {
    try {
      setLoading(true);
      const response = await floorApi.getById(floorId);
      setFloor(response.data.floor);
    } catch (error) {
      toast.error('Failed to load floor details');
      navigate('/floors');
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: `I'm interested in Floor ${floor?.floorNumber} - ${floor?.name}`,
    preferredContact: 'any',
    budget: '',
    moveInDate: '',
    additionalNotes: ''
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[\d\s\-\+\(\)]+$/, 'Phone number is not valid'),
    company: Yup.string()
      .max(200, 'Company name must be less than 200 characters'),
    message: Yup.string()
      .required('Message is required')
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message must be less than 1000 characters'),
    budget: Yup.number()
      .positive('Budget must be a positive number')
      .max(10000000, 'Budget exceeds maximum allowed'),
    moveInDate: Yup.date()
      .min(new Date().toISOString().split('T')[0], 'Move-in date must be in the future')
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);

      const inquiryData = {
        ...values,
        floorId,
        budget: values.budget ? Number(values.budget) : undefined,
        moveInDate: values.moveInDate || undefined
      };

      await inquiryApi.create(inquiryData);

      toast.success('Inquiry submitted successfully! We will contact you soon.');
      resetForm();
      navigate('/floors');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
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
    return null;
  }

  return (
    <>
      <Helmet>
        <title>
          {floor ? `Inquiry for Floor ${floor.floorNumber} | TowerSpace` : 'Submit Inquiry | TowerSpace'}
        </title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 transition-colors duration-300">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              to={`/floors/${floorId}`}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
            >
              <HiArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
              Back to floor details
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Inquiry for Floor {floor.floorNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Complete the form below to schedule a tour or request more information
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card p-8"
              >
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, setFieldValue }) => (
                    <Form className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Company
                            </label>
                            <Field
                              type="text"
                              id="company"
                              name="company"
                              className="input-field"
                              placeholder="ACME Corporation"
                              aria-describedby="company-error"
                            />
                            <ErrorMessage name="company" component="div" id="company-error" className="mt-1 text-sm text-red-600" role="alert" />
                          </div>
                        </div>
                      </div>

                      {/* Inquiry Details */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Inquiry Details</h3>

                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-1">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Message *
                            </label>
                            <span className="text-xs text-gray-500" aria-live="polite">
                              {values.message?.length || 0} / 1000
                            </span>
                          </div>
                          <Field
                            as="textarea"
                            id="message"
                            name="message"
                            rows="4"
                            className="input-field"
                            aria-required="true"
                            aria-describedby="message-error message-count"
                            maxLength={1000}
                          />
                          <ErrorMessage name="message" component="div" id="message-error" className="mt-1 text-sm text-red-600" role="alert" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Preferred Contact
                            </label>
                            <Field
                              as="select"
                              id="preferredContact"
                              name="preferredContact"
                              className="input-field"
                            >
                              <option value="any">Any Method</option>
                              <option value="email">Email</option>
                              <option value="phone">Phone</option>
                            </Field>
                          </div>

                          <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Budget (LKR)
                            </label>
                            <Field
                              type="number"
                              id="budget"
                              name="budget"
                              className="input-field"
                              placeholder="Optional"
                              min="0"
                              step="1000"
                              aria-describedby="budget-error"
                            />
                            <ErrorMessage name="budget" component="div" id="budget-error" className="mt-1 text-sm text-red-600" role="alert" />
                          </div>

                          <div>
                            <label htmlFor="moveInDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Desired Move-in Date
                            </label>
                            <Field
                              type="date"
                              id="moveInDate"
                              name="moveInDate"
                              className="input-field"
                              min={new Date().toISOString().split('T')[0]}
                              aria-describedby="moveInDate-error"
                            />
                            <ErrorMessage name="moveInDate" component="div" id="moveInDate-error" className="mt-1 text-sm text-red-600" role="alert" />
                          </div>
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div>
                        <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Additional Notes
                        </label>
                        <Field
                          as="textarea"
                          id="additionalNotes"
                          name="additionalNotes"
                          rows="3"
                          className="input-field"
                          placeholder="Any special requirements or questions..."
                          aria-describedby="additionalNotes-error"
                        />
                        <ErrorMessage name="additionalNotes" component="div" id="additionalNotes-error" className="mt-1 text-sm text-red-600" role="alert" />
                      </div>

                      {/* Submit Button */}
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
                              Submitting...
                            </span>
                          ) : (
                            'Submit Inquiry'
                          )}
                        </button>
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center">
                          By submitting this form, you agree to our Privacy Policy and Terms of Service.
                        </p>
                      </div>
                    </Form>
                  )}
                </Formik>
              </motion.div>
            </div>

            {/* Right Column - Floor Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Floor Summary */}
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <HiOfficeBuilding className="h-6 w-6 text-primary-600 dark:text-primary-400" /> {/* Updated here */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Floor Details</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Floor Number</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{floor.floorNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Name</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{floor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Area</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{floor.area.toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Annual Price</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{floor.formattedPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Monthly</span>
                      <span className="font-semibold text-gray-900 dark:text-white">LKR {floor.pricePerMonth?.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <span className={`font-semibold ${floor.status === 'available' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                        {floor.status === 'available' ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Need Help?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Our leasing team is ready to assist you with any questions.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <HiCalendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Schedule a personal tour</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <HiCurrencyDollar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Flexible leasing options available</span>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="card p-6 bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/20">
                  <h3 className="text-lg font-semibold mb-3 text-primary-800 dark:text-primary-300">What happens next?</h3>
                  <ol className="space-y-3 text-sm text-primary-700 dark:text-primary-400">
                    <li className="flex items-start">
                      <span className="font-bold mr-2">1.</span>
                      <span>We'll review your inquiry within 24 hours</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">2.</span>
                      <span>Schedule a personal tour of the space</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">3.</span>
                      <span>Receive a customized leasing proposal</span>
                    </li>
                  </ol>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InquiryFormPage;