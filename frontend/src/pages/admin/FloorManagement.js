import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiOfficeBuilding,
  HiSearch
} from 'react-icons/hi';
import { floorApi } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import FloorForm from '../../components/admin/FloorForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// ============================================================================
// DEBOUNCE HOOK
// ============================================================================
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// ============================================================================
// CONFIRMATION DIALOG COMPONENT
// ============================================================================
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, isDangerous = false }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-sm mx-4"
      >
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const FloorManagement = () => {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [sortBy, setSortBy] = useState('floorNumber');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Status change confirmation
  const [statusConfirm, setStatusConfirm] = useState({
    isOpen: false,
    floorId: null,
    newStatus: null
  });

  // Debounce search input
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const response = await floorApi.getAll({ limit: 100 });
      setFloors(response.data.floors || []);
    } catch (error) {
      toast.error('Failed to load floors');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedFloor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (floor) => {
    setSelectedFloor(floor);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm(id);
  };

  const handleDelete = async (id) => {
    try {
      await floorApi.delete(id);
      toast.success('Floor deleted successfully');
      fetchFloors();
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete floor');
    }
  };

  // Show confirmation dialog before changing status
  const handleStatusChangeClick = (floorId, newStatus) => {
    setStatusConfirm({
      isOpen: true,
      floorId,
      newStatus
    });
  };

  // Confirm and update status
  const handleConfirmStatusChange = async () => {
    const { floorId, newStatus } = statusConfirm;
    try {
      setUpdatingStatus(floorId);
      await floorApi.update(floorId, { status: newStatus });
      toast.success('Status updated successfully');
      fetchFloors();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
      setStatusConfirm({ isOpen: false, floorId: null, newStatus: null });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: {
        icon: <HiCheckCircle className="h-4 w-4" aria-hidden="true" />,
        color: 'bg-green-100 text-green-800',
        label: 'Available'
      },
      occupied: {
        icon: <HiXCircle className="h-4 w-4" aria-hidden="true" />,
        color: 'bg-red-100 text-red-800',
        label: 'Occupied'
      },
      under_maintenance: {
        icon: <HiClock className="h-4 w-4" aria-hidden="true" />,
        color: 'bg-yellow-100 text-yellow-800',
        label: 'Maintenance'
      },
      reserved: {
        icon: <HiClock className="h-4 w-4" aria-hidden="true" />,
        color: 'bg-blue-100 text-blue-800',
        label: 'Reserved'
      }
    };

    const config = statusConfig[status] || statusConfig.available;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${config.color}`}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </span>
    );
  };

  // Sort and filter floors
  const filteredAndSortedFloors = floors
    .filter(floor => 
      floor.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      floor.floorNumber.toString().includes(debouncedSearch) ||
      floor.description.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'floorNumber') {
        aValue = a.floorNumber;
        bValue = b.floorNumber;
      } else if (sortBy === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortBy === 'area') {
        aValue = a.area || 0;
        bValue = b.area || 0;
      } else if (sortBy === 'price') {
        aValue = a.price || 0;
        bValue = b.price || 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const floorToDelete = floors.find(f => f._id === deleteConfirm);

  // Handle column sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Sort indicator component
  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return sortOrder === 'asc' ? <span className="text-blue-600 ml-1">↑</span> : <span className="text-blue-600 ml-1">↓</span>;
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Floor Management</h1>
          <p className="text-gray-600">Manage office floors and availability</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary inline-flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          <HiPlus className="mr-2 h-5 w-5" aria-hidden="true" />
          Add New Floor
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Search floors by name, number, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            aria-label="Search floors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="table-header cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      onClick={() => handleSort('floorNumber')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Floor #</span>
                        <SortIcon field="floorNumber" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="table-header cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Name</span>
                        <SortIcon field="name" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="table-header cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      onClick={() => handleSort('area')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Area</span>
                        <SortIcon field="area" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="table-header cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Price</span>
                        <SortIcon field="price" />
                      </div>
                    </th>
                    <th scope="col" className="table-header">Status</th>
                    <th scope="col" className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedFloors.map((floor) => (
                    <motion.tr
                      key={floor._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="table-cell font-semibold text-gray-900">
                        {floor.floorNumber}
                      </td>
                      <td className="table-cell">
                        <div>
                          <div className="font-medium text-gray-900">{floor.name}</div>
                          <div className="text-sm text-gray-500" title={floor.description}>
                            {floor.description?.substring(0, 50)}
                            {floor.description?.length > 50 ? '...' : ''}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell text-gray-900">
                        {floor.area?.toLocaleString() || 'N/A'} sq ft
                      </td>
                      <td className="table-cell">
                        <div className="font-semibold text-gray-900">{floor.formattedPrice}</div>
                        <div className="text-sm text-gray-500">
                          ${floor.pricePerSqFt}/sq ft
                        </div>
                      </td>
                      <td className="table-cell">
                        {getStatusBadge(floor.status)}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(floor)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={`Edit floor ${floor.floorNumber}`}
                            title="Edit"
                          >
                            <HiPencil className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(floor._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label={`Delete floor ${floor.floorNumber}`}
                            title="Delete"
                          >
                            <HiTrash className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <select
                            value={floor.status}
                            onChange={(e) => handleStatusChangeClick(floor._id, e.target.value)}
                            disabled={updatingStatus === floor._id}
                            className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            aria-label={`Change status for floor ${floor.floorNumber}`}
                          >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="under_maintenance">Maintenance</option>
                            <option value="reserved">Reserved</option>
                          </select>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
              {filteredAndSortedFloors.map((floor) => (
                <motion.div
                  key={floor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg text-gray-900">Floor {floor.floorNumber}</div>
                      <div className="text-sm text-gray-600">{floor.name}</div>
                    </div>
                    {getStatusBadge(floor.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm border-t border-b border-gray-100 py-3">
                    <div>
                      <span className="text-gray-500 block text-xs">Area</span>
                      <div className="font-medium text-gray-900">{floor.area?.toLocaleString() || 'N/A'} sq ft</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs">Price</span>
                      <div className="font-medium text-gray-900">{floor.formattedPrice}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-600">Change Status</label>
                    <select
                      value={floor.status}
                      onChange={(e) => handleStatusChangeClick(floor._id, e.target.value)}
                      disabled={updatingStatus === floor._id}
                      className="w-full text-sm border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label={`Change status for floor ${floor.floorNumber}`}
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="under_maintenance">Maintenance</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t gap-2">
                    <button
                      onClick={() => handleEdit(floor)}
                      className="flex-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Edit floor ${floor.floorNumber}`}
                    >
                      <HiPencil className="h-4 w-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(floor._id)}
                      className="flex-1 px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Delete floor ${floor.floorNumber}`}
                    >
                      <HiTrash className="h-4 w-4 inline mr-1" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {!loading && filteredAndSortedFloors.length === 0 && floors.length > 0 && (
          <div className="text-center py-12">
            <HiSearch className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No floors found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search term</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:underline transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {!loading && floors.length === 0 && (
          <div className="text-center py-12">
            <HiOfficeBuilding className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No floors found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first floor</p>
            <button
              onClick={handleCreate}
              className="btn-primary inline-flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              <HiPlus className="mr-2 h-5 w-5" aria-hidden="true" />
              Add New Floor
            </button>
          </div>
        )}
      </div>

      {/* Floor Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedFloor ? 'Edit Floor' : 'Add New Floor'}
      >
        <FloorForm
          floor={selectedFloor}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchFloors();
          }}
        />
      </Modal>

      {/* Status Change Confirmation Dialog */}
      <ConfirmDialog
        isOpen={statusConfirm.isOpen}
        title="Change Floor Status"
        message={`Are you sure you want to change the status to "${statusConfirm.newStatus?.replace(/_/g, ' ')}"?`}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setStatusConfirm({ isOpen: false, floorId: null, newStatus: null })}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Confirm Delete"
        message={`Are you sure you want to delete Floor ${floorToDelete?.floorNumber} - ${floorToDelete?.name}? This action cannot be undone.`}
        onConfirm={() => handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        isDangerous={true}
      />
    </>
  );
};

export default FloorManagement;