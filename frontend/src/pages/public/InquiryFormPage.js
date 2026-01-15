import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  HiArrowLeft,
  HiBuildingOffice,
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
      .min(2, 'Name is too short')
      .max(100, 'Name is too long'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number'),
    company: Yup.string()
      .max(200, 'Company name is too long'),
    message: Yup.string()
      .required('Message is required')
      .max(1000, 'Message is too long'),
    budget: Yup.number()
      .min(0, 'Budget cannot be negative')
      .max(1000000, 'Budget is too high'),
    moveInDate: Yup.date()
      .min(new Date(), 'Move-in date must be in the future')
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
        <title>Inquiry for Floor {floor.floorNumber} | TowerSpace</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              to={`/floors/${floorId}`}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
            >
              <HiArrowLeft className="mr-2 h-5 w-5" />
              Back to floor details
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900">
              Inquiry for Floor {floor.floorNumber}
            </h1>
            <p className="text-gray-600 mt-2">
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
                        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name *
                            </label>
                            <Field
                              type="text"
                              name="name"
                              className="input-field"
                              placeholder="John Doe"
                            />
                            <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address *
                            </label>
                            <Field
                              type="email"
                              name="email"
                              className="input-field"
                              placeholder="john@example.com"
                            />
                            <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number *
                            </label>
                            <Field
                              type="tel"
                              name="phone"
                              className="input-field"
                              placeholder="+1 (555) 123-4567"
                            />
                            <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company
                            </label>
                            <Field
                              type="text"
                              name="company"
                              className="input-field"
                              placeholder="ACME Corporation"
                            />
                            <ErrorMessage name="company" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>
                      </div>

                      {/* Inquiry Details */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Inquiry Details</h3>
                        
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message *
                          </label>
                          <Field
                            as="textarea"
                            name="message"
                            rows="4"
                            className="input-field"
                          />
                          <ErrorMessage name="message" component="div" className="mt-1 text-sm text-red-600" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Preferred Contact
                            </label>
                            <Field
                              as="select"
                              name="preferredContact"
                              className="input-field"
                            >
                              <option value="any">Any Method</option>
                              <option value="email">Email</option>
                              <option value="phone">Phone</option>
                            </Field>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Budget ($)
                            </label>
                            <Field
                              type="number"
                              name="budget"
                              className="input-field"
                              placeholder="Optional"
                            />
                            <ErrorMessage name="budget" component="div" className="mt-1 text-sm text-red-600" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Desired Move-in Date
                            </label>
                            <Field
                              type="date"
                              name="moveInDate"
                              className="input-field"
                            />
                            <ErrorMessage name="moveInDate" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Notes
                        </label>
                        <Field
                          as="textarea"
                          name="additionalNotes"
                          rows="3"
                          className="input-field"
                          placeholder="Any special requirements or questions..."
                        />
                        <ErrorMessage name="additionalNotes" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-6 border-t">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full btn-primary py-3 text-lg"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                        </button>
                        <p className="mt-3 text-sm text-gray-600 text-center">
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
                    <HiBuildingOffice className="h-6 w-6 text-primary-600" />
                    <h3 className="text-lg font-semibold">Floor Details</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Floor Number</span>
                      <span className="font-semibold">{floor.floorNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name</span>
                      <span className="font-semibold">{floor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area</span>
                      <span className="font-semibold">{floor.area.toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Price</span>
                      <span className="font-semibold">{floor.formattedPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly</span>
                      <span className="font-semibold">${floor.pricePerMonth?.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className={`font-semibold ${
                        floor.status === 'available' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {floor.status === 'available' ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                  <p className="text-gray-600 mb-4">
                    Our leasing team is ready to assist you with any questions.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <HiCalendar className="h-5 w-5 text-primary-600" />
                      <span className="text-sm">Schedule a personal tour</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <HiCurrencyDollar className="h-5 w-5 text-primary-600" />
                      <span className="text-sm">Flexible leasing options available</span>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="card p-6 bg-primary-50 border-primary-100">
                  <h3 className="text-lg font-semibold mb-3 text-primary-800">What happens next?</h3>
                  <ol className="space-y-3 text-sm text-primary-700">
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