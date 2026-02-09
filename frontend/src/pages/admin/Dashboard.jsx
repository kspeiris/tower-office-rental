import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  HiOfficeBuilding,
  HiUsers,
  HiCurrencyDollar,
  HiChartBar,
  HiArrowUp,
  HiArrowDown,
  HiRefresh
} from 'react-icons/hi';
import { adminApi, inquiryApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/admin/StatCard';
import DashboardChart from '../../components/admin/DashboardChart';
import RecentInquiries from '../../components/admin/RecentInquiries';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [inquiryStats, setInquiryStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [statsResponse, inquiryStatsResponse] = await Promise.all([
        adminApi.getDashboardStats(),
        inquiryApi.getStats()
      ]);

      setStats(statsResponse.data.stats || statsResponse.data);
      setInquiryStats(inquiryStatsResponse.data);

      if (isRefresh) {
        toast.success('Dashboard refreshed');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const statCards = [
    {
      title: 'Total Floors',
      value: stats?.totalFloors || 0,
      icon: <HiOfficeBuilding className="h-6 w-6" aria-hidden="true" />,
      color: 'blue',
      description: 'All floors in the building'
    },
    {
      title: 'Available Floors',
      value: stats?.availableFloors || 0,
      icon: <HiOfficeBuilding className="h-6 w-6" aria-hidden="true" />,
      color: 'green',
      description: 'Ready for leasing'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats?.monthlyRevenue?.toLocaleString() || 0}`,
      icon: <HiCurrencyDollar className="h-6 w-6" aria-hidden="true" />,
      color: 'purple',
      description: 'Current month projection'
    },
    {
      title: 'New Inquiries',
      value: stats?.newInquiries || 0,
      icon: <HiUsers className="h-6 w-6" aria-hidden="true" />,
      color: 'orange',
      description: 'This week'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-red-600 text-lg font-semibold">{error}</div>
        <button
          onClick={() => fetchDashboardData()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | TowerSpace Admin</title>
        <meta name="description" content="TowerSpace admin dashboard overview" />
      </Helmet>

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your property.</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Refresh dashboard"
          >
            <HiRefresh
              className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Occupancy Chart */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Occupancy & Revenue</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last 30 days performance</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Occupancy Rate:</span>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400" aria-label={`Occupancy rate is ${stats?.occupancyRate || 0} percent`}>
                    {stats?.occupancyRate || 0}%
                  </span>
                </div>
              </div>
              <DashboardChart />
            </div>
          </div>

          {/* Inquiry Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Inquiry Statistics</h3>
            {inquiryStats?.stats?.statuses && inquiryStats.stats.statuses.length > 0 ? (
              <div className="space-y-4">
                {inquiryStats.stats.statuses.map((status, index) => {
                  const percentage = inquiryStats.stats.total > 0
                    ? ((status.count / inquiryStats.stats.total) * 100).toFixed(1)
                    : 0;

                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {status.status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 dark:text-white" aria-label={`${status.count} inquiries`}>
                          {status.count}
                        </span>
                        <div
                          className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                          role="progressbar"
                          aria-valuenow={percentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label={`${percentage}% of total inquiries`}
                        >
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <HiChartBar className="h-12 w-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                <p>No inquiry data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Inquiries</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Latest inquiries from potential tenants</p>
            </div>
            <button
              onClick={() => navigate('/admin/inquiries')}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium focus:outline-none focus:underline focus:ring-2 focus:ring-primary-500 rounded px-2 py-1 transition-colors"
            >
              View all
            </button>
          </div>
          <RecentInquiries />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;