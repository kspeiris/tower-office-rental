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
  HiClock
} from 'react-icons/hi';
import { inquiryApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const InquiryManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchInquiries();
  }, [filters]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await inquiryApi.getAll(filters);
      setInquiries(response.data.inquiries || []);
    } catch (error) {
      toast.error('Failed to load inquiries');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await inquiryApi.updateStatus(id, { status });
      toast.success('Status updated successfully');
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to update status');
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Floor</th>
                  <th className="table-header">Contact</th>
                  <th className="table-header">Date</th>
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
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View Details"
                        >
                          <HiEye className="h-4 w-4" />
                        </button>
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatusUpdate(inquiry._id, e.target.value)}
                          className="text-sm border rounded-lg px-2 py-1"
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
        )}

        {!loading && inquiries.length === 0 && (
          <div className="text-center py-12">
            <HiInbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {selectedInquiry.name}</p>
                  <p><strong>Company:</strong> {selectedInquiry.company || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedInquiry.email}</p>
                  <p><strong>Phone:</strong> {selectedInquiry.phone}</p>
                  <p><strong>Preferred Contact:</strong> {selectedInquiry.preferredContact}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Inquiry Details</h4>
                <div className="space-y-2">
                  <p><strong>Floor:</strong> Floor {selectedInquiry.floorId?.floorNumber} - {selectedInquiry.floorId?.name}</p>
                  <p><strong>Budget:</strong> {selectedInquiry.budget ? `$${selectedInquiry.budget.toLocaleString()}` : 'Not specified'}</p>
                  <p><strong>Move-in Date:</strong> {selectedInquiry.moveInDate ? formatDate(selectedInquiry.moveInDate) : 'Flexible'}</p>
                  <p><strong>Submitted:</strong> {formatDate(selectedInquiry.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <h4 className="font-semibold mb-2">Message</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedInquiry.message}</p>
              </div>
            </div>

            {/* Additional Notes */}
            {selectedInquiry.additionalNotes && (
              <div>
                <h4 className="font-semibold mb-2">Additional Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedInquiry.additionalNotes}</p>
                </div>
              </div>
            )}

            {/* Status History */}
            {selectedInquiry.respondedAt && (
              <div>
                <h4 className="font-semibold mb-2">Status History</h4>
                <div className="space-y-2">
                  <p><strong>Responded At:</strong> {formatDate(selectedInquiry.respondedAt)}</p>
                  <p><strong>Responded By:</strong> {selectedInquiry.respondedBy?.username || 'System'}</p>
                  {selectedInquiry.responseNotes && (
                    <p><strong>Response Notes:</strong> {selectedInquiry.responseNotes}</p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default InquiryManagement;