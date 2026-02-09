import React from 'react';
import FloorCard from './FloorCard';
import LoadingSpinner from '../common/LoadingSpinner';

const FloorGrid = ({ floors, loading, viewMode = 'grid', emptyMessage = 'No floors found' }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!floors || floors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No spaces available</h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        {floors.map((floor) => (
          <FloorCard key={floor._id} floor={floor} viewMode="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {floors.map((floor) => (
        <FloorCard key={floor._id} floor={floor} viewMode="grid" />
      ))}
    </div>
  );
};

export default FloorGrid;