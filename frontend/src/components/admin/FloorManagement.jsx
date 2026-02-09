import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiCheckCircle,
  HiXCircle,
  HiClock
} from 'react-icons/hi';
import { floorApi } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import FloorForm from './FloorForm';
import LoadingSpinner from '../common/LoadingSpinner';

const FloorManagement = () => {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const response = await floorApi.getAll({ limit: 50 });
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

  const handleStatusChange = async (id, status) => {
    try {
      await floorApi.update(id, { status });
      toast.success('Status updated successfully');
      fetchFloors();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: {
        icon: <HiCheckCircle className="h-4 w-4" />,
        color: 'bg-green-100 text-green-800',
        label: 'Available'
      },
      occupied: {
        icon: <HiXCircle className="h-4 w-4" />,
        color: 'bg-red-100 text-red-800',
        label: 'Occupied'
      },
      under_maintenance: {
        icon: <HiClock className="h-4 w-4" />,
        color: 'bg-yellow-100 text-yellow-800',
        label: 'Maintenance'
      },
      reserved: {
        icon: <HiClock className="h-4 w-4" />,
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

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Floor Management</h1>
          <p className="text-gray-600">Manage office floors and availability</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary inline-flex items-center"
        >
          <HiPlus className="mr-2 h-5 w-5" />
          Add New Floor
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Floor #</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Area</th>
                  <th className="table-header">Price</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {floors.map((floor) => (
                  <motion.tr
                    key={floor._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="table-cell font-semibold">
                      {floor.floorNumber}
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">{floor.name}</div>
                        <div className="text-sm text-gray-500">{floor.description.substring(0, 50)}...</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      {floor.area.toLocaleString()} sq ft
                    </td>
                    <td className="table-cell">
                      <div className="font-semibold">{floor.formattedPrice}</div>
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
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <HiPencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(floor._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <HiTrash className="h-4 w-4" />
                        </button>
                        <select
                          value={floor.status}
                          onChange={(e) => handleStatusChange(floor._id, e.target.value)}
                          className="text-sm border rounded-lg px-2 py-1"
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
        )}

        {!loading && floors.length === 0 && (
          <div className="text-center py-12">
            <HiBuildingOffice className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No floors found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first floor</p>
            <button
              onClick={handleCreate}
              className="btn-primary inline-flex items-center"
            >
              <HiPlus className="mr-2 h-5 w-5" />
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this floor? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FloorManagement;