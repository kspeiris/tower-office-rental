import React from 'react';
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiExclamation } from 'react-icons/hi';

const Toast = ({ message, type = 'info', onClose }) => {
  const config = {
    success: {
      icon: <HiCheckCircle className="h-5 w-5" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: <HiXCircle className="h-5 w-5" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: <HiExclamation className="h-5 w-5" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: <HiInformationCircle className="h-5 w-5" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500'
    }
  };

  const { icon, bgColor, borderColor, textColor, iconColor } = config[type];

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg shadow-lg p-4 max-w-md w-full`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${iconColor}`}>
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${textColor}`}>
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
          >
            <HiXCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;