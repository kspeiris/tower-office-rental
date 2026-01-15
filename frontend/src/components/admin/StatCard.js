import React from 'react';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi';

const StatCard = ({ title, value, icon, color, change, changeType }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  const bgColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'increase' ? (
                <HiArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <HiArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ml-1 ${
                  changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;