import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiSearch,
  HiFilter,
  HiEye,
  HiPhone,
  HiMail,
  HiCalendar,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi';
import { inquiryApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

// ============================================================================
// DEBOUNCE HOOK
// ============================================================================
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// ============================================================================
// CONFIRMATION DIALOG COMPONENT
// ============================================================================
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, isDangerous = false }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-sm mx-4"
      >
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const InquiryManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    inquiryId: null,
    newStatus: null
  });
  
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  
  // Debounce search input to prevent excessive API calls
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch inquiries when filters or sort changes
  useEffect(() => {
    fetchInquiries();
  }, [debouncedSearch, filters.status, page, sortBy, sortOrder]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await inquiryApi.getAll({
        status: filters.status,
        search: debouncedSearch,
        page,
        limit: 10,
        sortBy,
        sortOrder
      });
      setInquiries(response.data.inquiries || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load inquiries');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Show confirmation dialog before updating status
  const handleStatusUpdateClick = (id, newStatus) => {
    setConfirmDialog({
      isOpen: true,
      inquiryId: id,
      newStatus
    });
  };

  // Confirm and update status
  const handleConfirmStatusUpdate = async () => {
    const { inquiryId, newStatus } = confirmDialog;
    try {
      setUpdatingId(inquiryId);
      await inquiryApi.updateStatus(inquiryId, { status: newStatus });
      toast.success('Status updated successfully');
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
      setConfirmDialog({ isOpen: false, inquiryId: null, newStatus: null });
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      new: { color: 'bg-blue-100 text-blue-800', icon: <HiClock />, label: 'New' },
      contacted: { color: 'bg-purple-100 text-purple-800', icon: <HiPhone />, label: 'Contacted' },
      viewing_scheduled: { color: 'bg-yellow-100 text-yellow-800', icon: <HiCalendar />, label: 'Viewing Scheduled' },
      offer_sent: { color: 'bg-indigo-100 text-indigo-800', icon: <HiMail />, label: 'Offer Sent' },
      closed: { color: 'bg-green-100 text-green-800', icon: <HiCheckCircle />, label: 'Closed' },
      rejected: { color: 'bg-red-100 text-red-800', icon: <HiXCircle />, label: 'Rejected' }
    };

    const { color, icon, label } = config[status] || config.new;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${color}`}>
        {icon}
        <span className="ml-1">{label}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'viewing_scheduled', label: 'Viewing Scheduled' },
    { value: 'offer_sent', label: 'Offer Sent' },
    { value: 'closed', label: 'Closed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Handle column sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Sort indicator component
  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return sortOrder === 'asc' ? <span className="text-blue-600 ml-1">↑</span> : <span className="text-blue-600 ml-1">↓</span>;
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inquiry Management</h1>
        <p className="text-gray-600">Manage and track all rental inquiries</p>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="table-header cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Name</span>
                        <SortIcon field="name" />
                      </div>
                    </th>
                    <th className="table-header">Floor</th>
                    <th className="table-header">Contact</th>
                    <th 
                      className="table-header cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Date</span>
                        <SortIcon field="createdAt" />
                      </div>
                    </th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <motion.tr
                      key={inquiry._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="table-cell">
                        <div>
                          <div className="font-medium text-gray-900">{inquiry.name}</div>
                          <div className="text-sm text-gray-500">{inquiry.company || 'No company'}</div>
                        </div>
                      </td>
                      <td className="table-cell">
                        {inquiry.floorId ? (
                          <div>
                            <div className="font-medium">Floor {inquiry.floorId.floorNumber}</div>
                            <div className="text-sm text-gray-500">{inquiry.floorId.name}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="space-y-1">
                          <div className="text-sm">{inquiry.email}</div>
                          <div className="text-sm text-gray-500">{inquiry.phone}</div>
                        </div>
                      </td>
                      <td className="table-cell">
                        {formatDate(inquiry.createdAt)}
                      </td>
                      <td className="table-cell">
                        {getStatusBadge(inquiry.status)}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <HiEye className="h-5 w-5" />
                          </button>
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleStatusUpdateClick(inquiry._id, e.target.value)}
                            disabled={updatingId === inquiry._id}
                            className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="viewing_scheduled">Viewing Scheduled</option>
                            <option value="offer_sent">Offer Sent</option>
                            <option value="closed">Closed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {inquiries.length > 0 && (
              <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <HiChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <HiChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {!loading && inquiries.length === 0 && (
          <div className="text-center py-12">
            <HiMail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No inquiries found</h3>
            <p className="text-gray-600">When inquiries are submitted, they will appear here.</p>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Inquiry Details"
        size="lg"
      >
        {selectedInquiry && (
          <div className="space-y-6">
            {/* Inquiry Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4 text-gray-900">Personal Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name</span>
                    <p className="text-gray-900">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Company</span>
                    <p className="text-gray-900">{selectedInquiry.company || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email</span>
                    <p className="text-gray-900">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone</span>
                    <p className="text-gray-900">{selectedInquiry.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Preferred Contact</span>
                    <p className="text-gray-900">{selectedInquiry.preferredContact}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-gray-900">Inquiry Details</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Floor</span>
                    <p className="text-gray-900">
                      {selectedInquiry.floorId 
                        ? `Floor ${selectedInquiry.floorId.floorNumber} - ${selectedInquiry.floorId.name}` 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Budget</span>
                    <p className="text-gray-900">
                      {selectedInquiry.budget 
                        ? `$${selectedInquiry.budget.toLocaleString()}` 
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Move-in Date</span>
                    <p className="text-gray-900">
                      {selectedInquiry.moveInDate 
                        ? formatDate(selectedInquiry.moveInDate) 
                        : 'Flexible'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Submitted</span>
                    <p className="text-gray-900">{formatDate(selectedInquiry.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-900">Message</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedInquiry.message}</p>
              </div>
            </div>

            {/* Additional Notes */}
            {selectedInquiry.additionalNotes && (
              <div>
                <h4 className="font-semibold mb-2 text-gray-900">Additional Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedInquiry.additionalNotes}</p>
                </div>
              </div>
            )}

            {/* Status History */}
            {selectedInquiry.respondedAt && (
              <div>
                <h4 className="font-semibold mb-4 text-gray-900">Status History</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Responded At</span>
                    <p className="text-gray-900">{formatDate(selectedInquiry.respondedAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Responded By</span>
                    <p className="text-gray-900">{selectedInquiry.respondedBy?.username || 'System'}</p>
                  </div>
                  {selectedInquiry.responseNotes && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Response Notes</span>
                      <p className="text-gray-900">{selectedInquiry.responseNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Change Inquiry Status"
        message={`Are you sure you want to change the status to "${confirmDialog.newStatus?.replace(/_/g, ' ')}"?`}
        onConfirm={handleConfirmStatusUpdate}
        onCancel={() => setConfirmDialog({ isOpen: false, inquiryId: null, newStatus: null })}
      />
    </>
  );
};

export default InquiryManagement;