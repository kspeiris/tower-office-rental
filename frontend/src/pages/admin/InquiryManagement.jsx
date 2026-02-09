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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm mx-4 shadow-2xl border border-gray-100 dark:border-gray-700"
      >
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2.5 text-white rounded-xl transition-all shadow-lg font-semibold active:scale-95 ${isDangerous
              ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
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
      new: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300', icon: <HiClock />, label: 'New' },
      contacted: { color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300', icon: <HiPhone />, label: 'Contacted' },
      viewing_scheduled: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300', icon: <HiCalendar />, label: 'Viewing Scheduled' },
      offer_sent: { color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300', icon: <HiMail />, label: 'Offer Sent' },
      closed: { color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300', icon: <HiCheckCircle />, label: 'Closed' },
      rejected: { color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300', icon: <HiXCircle />, label: 'Rejected' }
    };

    const { color, icon, label } = config[status] || config.new;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${color}`}>
        {React.cloneElement(icon, { className: 'h-3.5 w-3.5 mr-1.5' })}
        {label}
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
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Inquiry Management</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Manage and track all rental inquiries</p>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white transition-all"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value} className="dark:bg-gray-900">
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
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
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
                      className="table-header cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors select-none"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Date</span>
                        <SortIcon field="createdAt" />
                      </div>
                    </th>
                    <th className="table-header">Status</th>
                    <th className="table-header text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900/50 divide-y divide-gray-100 dark:divide-gray-700">
                  {inquiries.map((inquiry) => (
                    <motion.tr
                      key={inquiry._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="table-cell">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{inquiry.name}</div>
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{inquiry.company || 'Private'}</div>
                        </div>
                      </td>
                      <td className="table-cell">
                        {inquiry.floorId ? (
                          <div>
                            <div className="font-bold text-gray-700 dark:text-gray-300">Floor {inquiry.floorId.floorNumber}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{inquiry.floorId.name}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">General</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{inquiry.email}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">{inquiry.phone}</div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{formatDate(inquiry.createdAt)}</span>
                      </td>
                      <td className="table-cell">
                        {getStatusBadge(inquiry.status)}
                      </td>
                      <td className="table-cell text-right">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                            title="View Details"
                          >
                            <HiEye className="h-5 w-5" />
                          </button>
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleStatusUpdateClick(inquiry._id, e.target.value)}
                            disabled={updatingId === inquiry._id}
                            className="text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 text-gray-700 dark:text-gray-300 transition-all font-medium"
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

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {inquiries.map((inquiry) => (
                <div key={inquiry._id} className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{inquiry.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{inquiry.company || 'Private'}</div>
                    </div>
                    {getStatusBadge(inquiry.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block text-xs font-semibold uppercase tracking-wider mb-1">Floor</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {inquiry.floorId ? `Floor ${inquiry.floorId.floorNumber}` : 'General'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block text-xs font-semibold uppercase tracking-wider mb-1">Date</span>
                      <span className="font-bold text-gray-900 dark:text-white">{formatDate(inquiry.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center space-x-2 text-blue-600 font-semibold text-sm"
                    >
                      <HiEye className="h-4 w-4" />
                      <span>Details</span>
                    </button>

                    <select
                      value={inquiry.status}
                      onChange={(e) => handleStatusUpdateClick(inquiry._id, e.target.value)}
                      disabled={updatingId === inquiry._id}
                      className="text-xs bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1.5 font-bold transition-all"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="viewing_scheduled">Viewing Scheduled</option>
                      <option value="offer_sent">Offer Sent</option>
                      <option value="closed">Closed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {inquiries.length > 0 && (
              <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors">
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Page {page} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <HiChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
            <HiMail className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No inquiries found</h3>
            <p className="text-gray-600 dark:text-gray-400">When inquiries are submitted, they will appear here.</p>
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
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">Personal Information</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Name</span>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Company</span>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedInquiry.company || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Email</span>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Phone</span>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedInquiry.phone}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Preferred Contact</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 capitalize">
                      {selectedInquiry.preferredContact}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">Inquiry Details</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Floor</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedInquiry.floorId
                        ? `Floor ${selectedInquiry.floorId.floorNumber} - ${selectedInquiry.floorId.name}`
                        : 'General Inquiry'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Budget</span>
                    <p className="text-primary-600 dark:text-primary-400 font-bold">
                      {selectedInquiry.budget
                        ? `$${selectedInquiry.budget.toLocaleString()}`
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Move-in Date</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedInquiry.moveInDate
                        ? formatDate(selectedInquiry.moveInDate)
                        : 'Flexible'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Submitted</span>
                    <p className="text-gray-900 dark:text-white font-medium">{formatDate(selectedInquiry.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Message</h4>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">"{selectedInquiry.message}"</p>
              </div>
            </div>

            {/* Additional Notes */}
            {selectedInquiry.additionalNotes && (
              <div>
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Additional Notes</h4>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedInquiry.additionalNotes}</p>
                </div>
              </div>
            )}

            {/* Status History */}
            {selectedInquiry.respondedAt && (
              <div>
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">Status History</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Responded At</span>
                    <p className="text-gray-900 dark:text-white font-medium">{formatDate(selectedInquiry.respondedAt)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Responded By</span>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedInquiry.respondedBy?.username || 'System'}</p>
                  </div>
                  {selectedInquiry.responseNotes && (
                    <div className="md:col-span-2">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Response Notes</span>
                      <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-xl border border-primary-100 dark:border-primary-900/20">
                        <p className="text-primary-900 dark:text-primary-300 font-medium">{selectedInquiry.responseNotes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t dark:border-gray-700">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold transition-colors"
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