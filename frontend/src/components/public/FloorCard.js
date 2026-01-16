import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HiArrowRight, HiCheckCircle, HiXCircle, HiClock, HiPhotograph } from 'react-icons/hi';

const FloorCard = ({ floor, viewMode = 'grid' }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <HiCheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />;
      case 'occupied':
        return <HiXCircle className="h-5 w-5 text-red-500" aria-hidden="true" />;
      default:
        return <HiClock className="h-5 w-5 text-yellow-500" aria-hidden="true" />;
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
              className="btn-primary inline-flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              View Details
              <HiArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
            {floor.status === 'available' && (
              <Link
                to={`/inquiry/${floor._id}`}
                className="btn-secondary inline-flex items-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
            alt={`${floor.name} - Floor ${floor.floorNumber}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <HiPhotograph className="h-16 w-16 text-white opacity-50" aria-hidden="true" />
            <span className="sr-only">No image available for {floor.name}</span>
          </div>
        )}
        {floor.isFeatured && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10 shadow-lg">
            Featured
          </div>
        )}
        <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm z-10 shadow-lg">
          {getStatusIcon(floor.status)}
          <span className="text-sm font-medium">{getStatusText(floor.status)}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">Floor {floor.floorNumber}</h3>
            <span className="text-2xl font-bold text-primary-600" aria-label={`Price: ${floor.formattedPrice}`}>
              {floor.formattedPrice}
            </span>
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">{floor.name}</h4>
          <p className="text-gray-600 line-clamp-2" title={floor.description}>
            {floor.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-gray-500">Area</div>
            <div className="font-semibold">{floor.area?.toLocaleString() || 'N/A'} sq ft</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Monthly</div>
            <div className="font-semibold">
              {floor.pricePerMonth ? `$${floor.pricePerMonth.toLocaleString()}/mo` : 'Contact'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Max Capacity</div>
            <div className="font-semibold">{floor.maxCapacity || 'N/A'} people</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">View</div>
            <div className="font-semibold capitalize">{floor.view || 'City'}</div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link
            to={`/floors/${floor._id}`}
            className="btn-primary flex-1 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label={`View details for ${floor.name}`}
          >
            View Details
            <HiArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
          {floor.status === 'available' ? (
            <Link
              to={`/inquiry/${floor._id}`}
              className="btn-secondary flex-1 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label={`Submit inquiry for ${floor.name}`}
            >
              Inquire
            </Link>
          ) : (
            <button
              disabled
              className="btn-secondary flex-1 inline-flex items-center justify-center opacity-50 cursor-not-allowed"
              aria-label="Space not available for inquiry"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
FloorCard.propTypes = {
  floor: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    floorNumber: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    area: PropTypes.number,
    formattedPrice: PropTypes.string,
    pricePerMonth: PropTypes.number,
    maxCapacity: PropTypes.number,
    view: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    isFeatured: PropTypes.bool
  }).isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list'])
};
export default FloorCard;