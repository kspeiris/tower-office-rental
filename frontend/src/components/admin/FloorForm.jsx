import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { HiX, HiUpload, HiTrash, HiPhotograph } from 'react-icons/hi';
import { floorApi } from '../../services/api';
import toast from 'react-hot-toast';

const FloorForm = ({ floor, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(floor?.images || []);
  const [floorPlanFile, setFloorPlanFile] = useState(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState(floor?.floorPlan || null);

  const initialValues = floor ? {
    floorNumber: floor.floorNumber,
    name: floor.name,
    description: floor.description,
    area: floor.area,
    pricePerSqFt: floor.pricePerSqFt,
    totalPrice: floor.totalPrice,
    status: floor.status,
    amenities: floor.amenities || [],
    maxCapacity: floor.maxCapacity || '',
    view: floor.view || 'city',
    leaseTerm: floor.leaseTerm || 'yearly',
    isFeatured: floor.isFeatured || false
  } : {
    floorNumber: '',
    name: '',
    description: '',
    area: '',
    pricePerSqFt: '',
    totalPrice: '',
    status: 'available',
    amenities: [],
    maxCapacity: '',
    view: 'city',
    leaseTerm: 'yearly',
    isFeatured: false
  };

  const validationSchema = Yup.object({
    floorNumber: Yup.number()
      .required('Floor number is required')
      .min(1, 'Must be at least 1')
      .max(100, 'Cannot exceed 100'),
    name: Yup.string()
      .required('Name is required')
      .max(100, 'Name is too long'),
    description: Yup.string()
      .required('Description is required')
      .max(1000, 'Description is too long'),
    area: Yup.number()
      .required('Area is required')
      .min(100, 'Minimum area is 100 sq ft')
      .max(10000, 'Maximum area is 10,000 sq ft'),
    pricePerSqFt: Yup.number()
      .required('Price per sq ft is required')
      .min(1, 'Minimum price is $1/sq ft')
      .max(100, 'Maximum price is $100/sq ft'),
    totalPrice: Yup.number()
      .required('Total price is required')
      .min(1000, 'Minimum price is $1,000'),
    status: Yup.string()
      .oneOf(['available', 'occupied', 'under_maintenance', 'reserved'])
      .required('Status is required')
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imagePreviews.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) {
        toast.error(`${file.name} is not a valid image type`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setImageFiles([...imageFiles, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = async (index, isExisting = false) => {
    if (isExisting && floor) {
      const imageUrl = imagePreviews[index];
      try {
        await floorApi.deleteImage(floor._id, imageUrl);
        toast.success('Image deleted');
      } catch (error) {
        toast.error('Failed to delete image');
        return;
      }
    }

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFloorPlanChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.type);
    const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

    if (!isValidType) {
      toast.error('Floor plan must be an image or PDF');
      return;
    }
    if (!isValidSize) {
      toast.error('Floor plan is too large (max 10MB)');
      return;
    }

    setFloorPlanFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFloorPlanPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeFloorPlan = () => {
    setFloorPlanFile(null);
    setFloorPlanPreview(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append all form fields
      Object.keys(values).forEach(key => {
        if (key === 'amenities') {
          values[key].forEach(amenity => {
            formData.append('amenities[]', amenity);
          });
        } else {
          formData.append(key, values[key]);
        }
      });

      // Append image files
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      // Append floor plan file
      if (floorPlanFile) {
        formData.append('floorPlan', floorPlanFile);
      }

      if (floor) {
        await floorApi.update(floor._id, formData);
        toast.success('Floor updated successfully');
      } else {
        await floorApi.create(formData);
        toast.success('Floor created successfully');
      }

      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred');
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  const amenitiesOptions = [
    'high_speed_internet',
    'conference_rooms',
    'parking',
    'security',
    'cafeteria',
    'gym',
    'elevator',
    'air_conditioning',
    'cleaning_services',
    'reception'
  ];

  const viewOptions = [
    { value: 'city', label: 'City View' },
    { value: 'river', label: 'River View' },
    { value: 'park', label: 'Park View' },
    { value: 'ocean', label: 'Ocean View' },
    { value: 'mountain', label: 'Mountain View' }
  ];

  const leaseTermOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'under_maintenance', label: 'Under Maintenance' },
    { value: 'reserved', label: 'Reserved' }
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Floor Number *
              </label>
              <Field
                type="number"
                name="floorNumber"
                className="input-field"
              />
              <ErrorMessage name="floorNumber" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Floor Name *
              </label>
              <Field
                type="text"
                name="name"
                placeholder="e.g., Executive Suite, Corner Office"
                className="input-field"
              />
              <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <Field
                as="textarea"
                name="description"
                rows="3"
                placeholder="Describe the floor features, layout, and benefits..."
                className="input-field"
              />
              <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Floor Images (Max 5)
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index, !imageFiles[index])}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {imagePreviews.length < 5 && (
                <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                  <HiUpload className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Upload up to 5 images (JPEG, PNG, WebP, max 5MB each)
            </p>
          </div>

          {/* Floor Plan Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Floor Plan (Optional)
            </label>

            {floorPlanPreview ? (
              <div className="relative inline-block">
                {floorPlanPreview.includes('pdf') ? (
                  <div className="w-48 h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                    <HiPhotograph className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 font-medium">PDF File</span>
                  </div>
                ) : (
                  <img
                    src={floorPlanPreview}
                    alt="Floor plan preview"
                    className="w-48 h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                  />
                )}
                <button
                  type="button"
                  onClick={removeFloorPlan}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <HiTrash className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="w-48 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                <HiUpload className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Upload Floor Plan</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFloorPlanChange}
                  className="hidden"
                />
              </label>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Upload floor plan (JPEG, PNG, PDF, max 10MB)
            </p>
          </div>

          {/* Size and Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Area (sq ft) *
              </label>
              <Field
                type="number"
                name="area"
                className="input-field"
              />
              <ErrorMessage name="area" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price per sq ft ($) *
              </label>
              <Field
                type="number"
                name="pricePerSqFt"
                step="0.01"
                className="input-field"
              />
              <ErrorMessage name="pricePerSqFt" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Price ($) *
              </label>
              <Field
                type="number"
                name="totalPrice"
                className="input-field"
              />
              <ErrorMessage name="totalPrice" component="div" className="mt-1 text-sm text-red-600" />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Calculated: ${(values.area * values.pricePerSqFt || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Capacity
              </label>
              <Field
                type="number"
                name="maxCapacity"
                className="input-field"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                View
              </label>
              <Field
                as="select"
                name="view"
                className="input-field"
              >
                {viewOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lease Term
              </label>
              <Field
                as="select"
                name="leaseTerm"
                className="input-field"
              >
                {leaseTermOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status *
              </label>
              <Field
                as="select"
                name="status"
                className="input-field"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="status" component="div" className="mt-1 text-sm text-red-600" />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {amenitiesOptions.map((amenity) => {
                const isSelected = values.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => {
                      const newAmenities = isSelected
                        ? values.amenities.filter(a => a !== amenity)
                        : [...values.amenities, amenity];
                      setFieldValue('amenities', newAmenities);
                    }}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg border transition-all ${isSelected
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-600 dark:border-primary-500 text-primary-700 dark:text-primary-300'
                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    <span className="text-sm capitalize">
                      {amenity.replace(/_/g, ' ')}
                    </span>
                    {isSelected && <HiX className="ml-1 h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center">
            <Field
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              className="h-4 w-4 text-primary-600 rounded"
            />
            <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
              Mark as featured space
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onSuccess}
              className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : floor ? 'Update Floor' : 'Create Floor'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FloorForm;