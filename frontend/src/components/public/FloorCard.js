import React from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiCheckCircle, HiXCircle, HiClock, HiPhotograph } from 'react-icons/hi';

const FloorCard = ({ floor, viewMode = 'grid' }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <HiCheckCircle className="h-5 w-5 text-green-500" />;
      case 'occupied':
        return <HiXCircle className="h-5 w-5 text-red-500" />;
      default:
        return <HiClock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'occupied':
        return 'Occupied';
      case 'under_maintenance':
        return 'Under Maintenance';
      case 'reserved':
        return 'Reserved';
      default:
        return status;
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Floor {floor.floorNumber} - {floor.name}
              </h3>
              <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100">
                {getStatusIcon(floor.status)}
                <span className="text-sm font-medium">{getStatusText(floor.status)}</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{floor.description.substring(0, 150)}...</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Area</div>
                <div className="font-semibold">{floor.area.toLocaleString()} sq ft</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Price</div>
                <div className="font-semibold">{floor.formattedPrice}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Monthly</div>
                <div className="font-semibold">${floor.pricePerMonth?.toLocaleString()}/mo</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Max Capacity</div>
                <div className="font-semibold">{floor.maxCapacity || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <Link
              to={`/floors/${floor._id}`}
              className="btn-primary inline-flex items-center"
            >
              View Details
              <HiArrowRight className="ml-2 h-5 w-5" />
            </Link>
            {floor.status === 'available' && (
              <Link
                to={`/inquiry/${floor._id}`}
                className="btn-secondary inline-flex items-center"
              >
                Submit Inquiry
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="card overflow-hidden group hover:shadow-2xl transition-all duration-300">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {floor.images && floor.images.length > 0 ? (
          <img
            src={floor.images[0]}
            alt={floor.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <HiPhotograph className="h-16 w-16 text-white opacity-50" />
          </div>
        )}
        {floor.isFeatured && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
            Featured
          </div>
        )}
        <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm z-10">
          {getStatusIcon(floor.status)}
          <span className="text-sm font-medium">{getStatusText(floor.status)}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">Floor {floor.floorNumber}</h3>
            <span className="text-2xl font-bold text-primary-600">{floor.formattedPrice}</span>
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">{floor.name}</h4>
          <p className="text-gray-600 line-clamp-2">{floor.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-gray-500">Area</div>
            <div className="font-semibold">{floor.area.toLocaleString()} sq ft</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Monthly</div>
            <div className="font-semibold">${floor.pricePerMonth?.toLocaleString()}/mo</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Max Capacity</div>
            <div className="font-semibold">{floor.maxCapacity || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">View</div>
            <div className="font-semibold capitalize">{floor.view || 'City'}</div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link
            to={`/floors/${floor._id}`}
            className="btn-primary flex-1 inline-flex items-center justify-center"
          >
            View Details
            <HiArrowRight className="ml-2 h-5 w-5" />
          </Link>
          {floor.status === 'available' && (
            <Link
              to={`/inquiry/${floor._id}`}
              className="btn-secondary flex-1 inline-flex items-center justify-center"
            >
              Inquire
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloorCard;