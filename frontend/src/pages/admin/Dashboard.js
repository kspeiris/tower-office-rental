import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  HiBuildingOffice,
  HiUsers,
  HiCurrencyDollar,
  HiChartBar,
  HiArrowUp,
  HiArrowDown
} from 'react-icons/hi';
import { adminApi, inquiryApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/admin/StatCard';
import DashboardChart from '../../components/admin/DashboardChart';
import RecentInquiries from '../../components/admin/RecentInquiries';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [inquiryStats, setInquiryStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, inquiryStatsResponse] = await Promise.all([
        adminApi.getDashboardStats(),
        inquiryApi.getStats()
      ]);
      
      setStats(statsResponse.data.stats);
      setInquiryStats(inquiryStatsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Floors',
      value: stats?.totalFloors || 0,
      icon: <HiBuildingOffice className="h-6 w-6" />,
      color: 'blue',
      change: '+2%',
      changeType: 'increase'
    },
    {
      title: 'Available Floors',
      value: stats?.availableFloors || 0,
      icon: <HiBuildingOffice className="h-6 w-6" />,
      color: 'green',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats?.monthlyRevenue?.toLocaleString() || 0}`,
      icon: <HiCurrencyDollar className="h-6 w-6" />,
      color: 'purple',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'New Inquiries',
      value: stats?.newInquiries || 0,
      icon: <HiUsers className="h-6 w-6" />,
      color: 'orange',
      change: '-3%',
      changeType: 'decrease'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | TowerSpace Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your property.</p>
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
                  <h3 className="text-lg font-semibold text-gray-900">Occupancy & Revenue</h3>
                  <p className="text-sm text-gray-600">Last 30 days performance</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Occupancy Rate:</span>
                  <span className="text-lg font-bold text-primary-600">
                    {stats?.occupancyRate || 0}%
                  </span>
                </div>
              </div>
              <DashboardChart />
            </div>
          </div>

          {/* Inquiry Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Inquiry Statistics</h3>
            <div className="space-y-4">
              {inquiryStats?.stats?.statuses?.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{status.status.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{status.count}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ 
                          width: `${(status.count / inquiryStats.stats.total) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Inquiries</h3>
              <p className="text-sm text-gray-600">Latest inquiries from potential tenants</p>
            </div>
            <button className="text-primary-600 hover:text-primary-700 font-medium">
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