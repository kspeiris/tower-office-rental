import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from '../common/Modal';
import { inquiryApi } from '../../services/api';
import toast from 'react-hot-toast';

const InquiryModal = ({ isOpen, onClose, floor }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: floor ? `I'm interested in Floor ${floor.floorNumber} - ${floor.name}` : '',
    preferredContact: 'any'
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
      .max(1000, 'Message is too long')
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      
      const inquiryData = {
        ...values,
        floorId: floor._id
      };

      await inquiryApi.create(inquiryData);
      
      toast.success('Inquiry submitted successfully! We will contact you soon.');
      resetForm();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!floor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Inquire about Floor ${floor.floorNumber}`}
      size="md"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Contact Method
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

            <div className="pt-4 border-t">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default InquiryModal;