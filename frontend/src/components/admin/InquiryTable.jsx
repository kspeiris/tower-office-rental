import React from 'react';
import {
  HiEye,
  HiPhone,
  HiMail,
  HiCalendar,
  HiCheckCircle,
  HiXCircle,
  HiClock
} from 'react-icons/hi';

const InquiryTable = ({ inquiries, onViewDetails, onStatusChange, loading }) => {
  const getStatusBadge = (status) => {
    const config = {
      new: { color: 'bg-blue-100 text-blue-800', icon: <HiClock className="h-4 w-4" />, label: 'New' },
      contacted: { color: 'bg-purple-100 text-purple-800', icon: <HiPhone className="h-4 w-4" />, label: 'Contacted' },
      viewing_scheduled: { color: 'bg-yellow-100 text-yellow-800', icon: <HiCalendar className="h-4 w-4" />, label: 'Viewing Scheduled' },
      offer_sent: { color: 'bg-indigo-100 text-indigo-800', icon: <HiMail className="h-4 w-4" />, label: 'Offer Sent' },
      closed: { color: 'bg-green-100 text-green-800', icon: <HiCheckCircle className="h-4 w-4" />, label: 'Closed' },
      rejected: { color: 'bg-red-100 text-red-800', icon: <HiXCircle className="h-4 w-4" />, label: 'Rejected' }
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  if (!inquiries || inquiries.length === 0) {
    return (
      <div className="text-center py-12">
        <HiMail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No inquiries found</h3>
        <p className="text-gray-600">When inquiries are submitted, they will appear here.</p>
      </div>
    );
  }

  return (
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
            <tr key={inquiry._id} className="hover:bg-gray-50">
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
                    onClick={() => onViewDetails(inquiry)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="View Details"
                  >
                    <HiEye className="h-4 w-4" />
                  </button>
                  <select
                    value={inquiry.status}
                    onChange={(e) => onStatusChange(inquiry._id, e.target.value)}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InquiryTable;