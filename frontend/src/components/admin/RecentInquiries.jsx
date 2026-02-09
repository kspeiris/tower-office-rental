import React, { useState, useEffect } from 'react';
import { HiMail, HiPhone, HiClock } from 'react-icons/hi';
import { inquiryApi } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const RecentInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentInquiries();
  }, []);

  const fetchRecentInquiries = async () => {
    try {
      setLoading(true);
      const response = await inquiryApi.getAll({ limit: 5, sort: '-createdAt' });
      setInquiries(response.data.inquiries || []);
    } catch (error) {
      console.error('Error fetching recent inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      contacted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      viewing_scheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      offer_sent: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      closed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[status] || colors.new;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <HiMail className="h-12 w-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
        <p>No recent inquiries</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <div
          key={inquiry._id}
          className="flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
        >
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                {inquiry.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {inquiry.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {inquiry.company || 'No company'}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(inquiry.status)}`}>
                {inquiry.status.replace('_', ' ')}
              </span>
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <HiMail className="h-3 w-3 mr-1" />
                {inquiry.email}
              </div>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <HiPhone className="h-3 w-3 mr-1" />
                {inquiry.phone}
              </div>
            </div>

            {inquiry.floorId && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Interested in Floor {inquiry.floorId.floorNumber} - {inquiry.floorId.name}
              </div>
            )}

            <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
              <HiClock className="h-3 w-3 mr-1" />
              {formatDate(inquiry.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentInquiries;