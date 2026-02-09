import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  HiSearch,
  HiFilter,
  HiAdjustments,
  HiViewGrid,
  HiViewList,
  HiX
} from 'react-icons/hi';
import { floorApi } from '../../services/api';
import FloorCard from '../../components/public/FloorCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
const FloorsPage = () => {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 12
  });
  const [filters, setFilters] = useState({
    status: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    sortBy: 'floorNumber',
    sortOrder: 'asc',
    page: 1,
    limit: 12
  });
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    fetchFloors();
  }, [filters, debouncedSearchTerm]);

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm })
      };

      const response = await floorApi.getAll(params);
      setFloors(response.data.floors || []);

      // Update pagination without triggering another fetch
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching floors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page on filter change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };



  const clearFilters = () => {
    setFilters({
      status: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      sortBy: 'floorNumber',
      sortOrder: 'asc'
    });
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'under_maintenance', label: 'Under Maintenance' },
    { value: 'reserved', label: 'Reserved' }
  ];

  const sortOptions = [
    { value: 'floorNumber:asc', label: 'Floor Number (Low to High)' },
    { value: 'floorNumber:desc', label: 'Floor Number (High to Low)' },
    { value: 'totalPrice:asc', label: 'Price (Low to High)' },
    { value: 'totalPrice:desc', label: 'Price (High to Low)' },
    { value: 'area:asc', label: 'Area (Small to Large)' },
    { value: 'area:desc', label: 'Area (Large to Small)' }
  ];

  const activeFiltersCount = Object.entries(filters)
    .filter(([key, value]) => key !== 'sortBy' && key !== 'sortOrder' && value !== '')
    .length + (searchTerm ? 1 : 0);

  return (
    <>
      <Helmet>
        <title>Available Office Spaces | TowerSpace</title>
        <meta name="description" content="Browse available office spaces and find your perfect workspace at TowerSpace." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Available Spaces</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Find your perfect office space among our premium selections
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-6 md:py-8 bg-white dark:bg-gray-950 border-b dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 w-full lg:max-w-2xl">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary-500/5 rounded-xl blur transition-opacity opacity-0 group-focus-within:opacity-100"></div>
                <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search floors, names, or amenities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium"
                  aria-label="Search office spaces"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between lg:justify-end space-x-3 w-full lg:w-auto">
              {/* View Toggle (Hidden on small mobile) */}
              <div className="hidden sm:flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700'}`}
                  aria-label="Grid view"
                >
                  <HiViewGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700'}`}
                  aria-label="List view"
                >
                  <HiViewList className="h-5 w-5" />
                </button>
              </div>

              {/* Sort Select */}
              <div className="flex-1 lg:flex-initial">
                <select
                  value={`${filters.sortBy}:${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split(':');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  className="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium transition-all"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold transition-all ${showFilters || activeFiltersCount > 0 ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
              >
                <HiFilter className="h-5 w-5" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-primary-600 text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="mt-6 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md shadow-xl overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-cyan-500 to-primary-600"></div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black flex items-center text-gray-900 dark:text-white uppercase tracking-tighter italic">
                    <HiAdjustments className="mr-3 h-6 w-6 text-primary-500" />
                    Refine Options
                  </h3>
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={clearFilters}
                      className="text-sm font-bold text-primary-600 hover:text-primary-700 underline underline-offset-4"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    >
                      <HiX className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Status Filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">
                      Space Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full border-2 border-transparent bg-white dark:bg-gray-800 rounded-xl px-5 py-4 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-gray-900 dark:text-gray-100 font-bold shadow-sm"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">
                      Budget Range ($)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-full border-2 border-transparent bg-white dark:bg-gray-800 rounded-xl px-4 py-4 focus:border-primary-500 transition-all font-bold shadow-sm"
                      />
                      <span className="text-gray-400">—</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-full border-2 border-transparent bg-white dark:bg-gray-800 rounded-xl px-4 py-4 focus:border-primary-500 transition-all font-bold shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Area Range */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">
                      Area Coverage (SQ FT)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minArea}
                        onChange={(e) => handleFilterChange('minArea', e.target.value)}
                        className="w-full border-2 border-transparent bg-white dark:bg-gray-800 rounded-xl px-4 py-4 focus:border-primary-500 transition-all font-bold shadow-sm"
                      />
                      <span className="text-gray-400">—</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxArea}
                        onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                        className="w-full border-2 border-transparent bg-white dark:bg-gray-800 rounded-xl px-4 py-4 focus:border-primary-500 transition-all font-bold shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Floors Grid/List */}
      <section className="py-8 bg-gray-50 dark:bg-gray-950 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{floors.length}</span> of{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> spaces
                </p>
              </div>

              {/* Floors Display */}
              {floors.length > 0 ? (
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
                }>
                  {floors.map((floor, index) => (
                    <motion.div
                      key={floor._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <FloorCard floor={floor} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <HiSearch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No spaces found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      aria-label="Previous page"
                    >
                      Previous
                    </button>

                    {(() => {
                      const maxPagesToShow = 5;
                      const halfRange = Math.floor(maxPagesToShow / 2);
                      let startPage = Math.max(1, pagination.page - halfRange);
                      let endPage = Math.min(pagination.pages, startPage + maxPagesToShow - 1);

                      if (endPage - startPage < maxPagesToShow - 1) {
                        startPage = Math.max(1, endPage - maxPagesToShow + 1);
                      }

                      return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                        const pageNum = startPage + i;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${pagination.page === pageNum
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            aria-label={`Page ${pageNum}`}
                            aria-current={pagination.page === pageNum ? 'page' : undefined}
                          >
                            {pageNum}
                          </button>
                        );
                      });
                    })()}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default FloorsPage;