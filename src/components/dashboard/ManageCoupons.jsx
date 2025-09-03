import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { MdEdit, MdDelete, MdAdd, MdLocalOffer, MdSearch, MdFilterList } from 'react-icons/md';
import { BiSolidOffer } from 'react-icons/bi';
import {
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon
} from '../../https';
import Button from '../ui/Button';
import Modal from '../shared/Modal';
import { formatDate } from '../../utils';

const ManageCoupons = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        discountPercentage: '',
        expirationDate: '',
        isActive: true
    });

    const queryClient = useQueryClient();

    // Get coupons query
    const { data: resData, isLoading } = useQuery({
        queryKey: ['coupons'],
        queryFn: async () => {
            const response = await getCoupons();
            return response.data;
        },
    });

    const coupons = resData?.data || [];

    // Create coupon mutation
    const createCouponMutation = useMutation({
        mutationFn: createCoupon,
        onSuccess: (data) => {
            enqueueSnackbar(data.data.message, { variant: 'success' });
            setShowCreateModal(false);
            resetForm();
            queryClient.invalidateQueries(['coupons']);
        },
        onError: (error) => {
            enqueueSnackbar(error.response?.data?.message || 'Failed to create coupon', { variant: 'error' });
        },
    });

    // Update coupon mutation
    const updateCouponMutation = useMutation({
        mutationFn: updateCoupon,
        onSuccess: (data) => {
            enqueueSnackbar(data.data.message, { variant: 'success' });
            setShowEditModal(false);
            setEditingCoupon(null);
            resetForm();
            queryClient.invalidateQueries(['coupons']);
        },
        onError: (error) => {
            enqueueSnackbar(error.response?.data?.message || 'Failed to update coupon', { variant: 'error' });
        },
    });

    // Delete coupon mutation
    const deleteCouponMutation = useMutation({
        mutationFn: deleteCoupon,
        onSuccess: (data) => {
            enqueueSnackbar(data.data.message, { variant: 'success' });
            setShowDeleteModal(false);
            setCouponToDelete(null);
            queryClient.invalidateQueries(['coupons']);
        },
        onError: (error) => {
            enqueueSnackbar(error.response?.data?.message || 'Failed to delete coupon', { variant: 'error' });
        },
    });

    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === '' ||
            (statusFilter === 'active' && coupon.isActive) ||
            (statusFilter === 'inactive' && !coupon.isActive) ||
            (statusFilter === 'expired' && new Date(coupon.expirationDate) < new Date());
        return matchesSearch && matchesStatus;
    });

    const resetForm = () => {
        setFormData({
            code: '',
            discountPercentage: '',
            expirationDate: '',
            isActive: true
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        const couponData = {
            ...formData,
            discountPercentage: Number(formData.discountPercentage),
            expirationDate: new Date(formData.expirationDate).toISOString(),
        };
        createCouponMutation.mutate(couponData);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const couponData = {
            couponId: editingCoupon._id,
            ...formData,
            discountPercentage: Number(formData.discountPercentage),
            expirationDate: new Date(formData.expirationDate).toISOString(),
        };
        updateCouponMutation.mutate(couponData);
    };

    const openEditModal = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            discountPercentage: coupon.discountPercentage.toString(),
            expirationDate: new Date(coupon.expirationDate).toISOString().split('T')[0],
            isActive: coupon.isActive
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (coupon) => {
        setCouponToDelete(coupon);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        deleteCouponMutation.mutate(couponToDelete._id);
    };

    const resetCreateForm = () => {
        resetForm();
        setShowCreateModal(false);
    };

    const resetEditForm = () => {
        resetForm();
        setEditingCoupon(null);
        setShowEditModal(false);
    };

    const resetDeleteForm = () => {
        setCouponToDelete(null);
        setShowDeleteModal(false);
    };

    const isExpired = (date) => new Date(date) < new Date();

    // Skeleton loader component
    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
            <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
            <td className="px-6 py-4">
                <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
            </td>
        </tr>
    );

    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Header Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 animate-pulse">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                <div className="h-8 bg-gray-200 rounded-lg w-64"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-80"></div>
                        </div>
                        <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                    </div>
                </div>

                {/* Filter Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 animate-pulse">
                    <div className="flex gap-4">
                        <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                        <div className="w-48 h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Code', 'Discount', 'Expires', 'Status', 'Expired', 'Actions'].map((header, index) => (
                                    <th key={index} className="px-6 py-3">
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <SkeletonRow key={index} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                                <MdLocalOffer className="text-white text-xl" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Manage Coupons
                            </h1>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Create, edit, and manage your discount coupons
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                {filteredCoupons.filter(coupon => coupon.isActive && !isExpired(coupon.expirationDate)).length} Active
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                {filteredCoupons.filter(coupon => isExpired(coupon.expirationDate)).length} Expired
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                {filteredCoupons.length} Total Coupons
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setShowCreateModal(true)}
                        icon={<MdAdd />}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    >
                        Create Coupon
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {filteredCoupons.length} coupons found
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Coupons
                            </label>
                            <div className="relative">
                                <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                <input
                                    type="text"
                                    placeholder="Search by coupon code..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <div className="relative">
                                <MdFilterList className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg z-10" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full pl-12 pr-10 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-gray-50 focus:bg-white transition-all duration-200 shadow-sm cursor-pointer"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="expired">Expired</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coupons Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Code
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Discount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Expires
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Expired
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCoupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                                    <MdLocalOffer className="h-5 w-5 text-orange-600" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{coupon.code}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">{coupon.discountPercentage}%</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formatDate(new Date(coupon.expirationDate))}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${coupon.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${isExpired(coupon.expirationDate)
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                            {isExpired(coupon.expirationDate) ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEditModal(coupon)}
                                                icon={<MdEdit />}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openDeleteModal(coupon)}
                                                icon={<MdDelete />}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredCoupons.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="text-center py-16 px-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-red-100 rounded-full blur-3xl opacity-30 transform scale-150"></div>
                                <div className="relative p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-full inline-block">
                                    <BiSolidOffer className="h-16 w-16 text-gray-400" />
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <h3 className="text-xl font-semibold text-gray-900">No coupons found</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-600">
                                        {searchTerm || statusFilter
                                            ? "We couldn't find any coupons matching your search criteria."
                                            : "You haven't created any coupons yet. Start by creating your first discount coupon!"
                                        }
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                                        {searchTerm && (
                                            <span className="px-3 py-1 bg-gray-100 rounded-full">
                                                Search: "{searchTerm}"
                                            </span>
                                        )}
                                        {statusFilter && (
                                            <span className="px-3 py-1 bg-gray-100 rounded-full">
                                                Status: {statusFilter}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                                {(searchTerm || statusFilter) ? (
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setStatusFilter('');
                                        }}
                                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                                    >
                                        Clear Filters
                                    </Button>
                                ) : (
                                    <div className="space-y-3">
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowCreateModal(true)}
                                            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                                            icon={<MdAdd />}
                                        >
                                            Create Your First Coupon
                                        </Button>
                                        <p className="text-xs text-gray-500">
                                            Start offering discounts to your customers
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Coupon Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={resetCreateForm}
                title={
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <MdAdd className="text-orange-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Create New Coupon</h3>
                            <p className="text-sm text-gray-500">Add a new discount coupon</p>
                        </div>
                    </div>
                }
            >
                <form onSubmit={handleCreateSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-3 text-sm font-semibold">
                                Coupon Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 uppercase"
                                placeholder="SAVE20"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-3 text-sm font-semibold">
                                Discount Percentage <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="discountPercentage"
                                    value={formData.discountPercentage}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="10"
                                    min="0"
                                    max="100"
                                    required
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-3 text-sm font-semibold">
                            Expiration Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="expirationDate"
                            value={formData.expirationDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 cursor-pointer">
                                    Active Coupon
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    Make this coupon available for use
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={resetCreateForm}
                            className="flex-1 py-3 border border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={createCouponMutation.isLoading}
                            className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        >
                            {createCouponMutation.isLoading ? 'Creating...' : 'Create Coupon'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Coupon Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={resetEditForm}
                title={
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <MdEdit className="text-blue-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Edit Coupon</h3>
                            <p className="text-sm text-gray-500">Update coupon details</p>
                        </div>
                    </div>
                }
            >
                {editingCoupon && (
                    <form onSubmit={handleEditSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 mb-3 text-sm font-semibold">
                                    Coupon Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 uppercase"
                                    placeholder="SAVE20"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-3 text-sm font-semibold">
                                    Discount Percentage <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="discountPercentage"
                                        value={formData.discountPercentage}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        placeholder="10"
                                        min="0"
                                        max="100"
                                        required
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-3 text-sm font-semibold">
                                Expiration Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="expirationDate"
                                value={formData.expirationDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label htmlFor="editIsActive" className="text-sm font-semibold text-gray-700 cursor-pointer">
                                        Active Coupon
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Make this coupon available for use
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        id="editIsActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={resetEditForm}
                                className="flex-1 py-3 border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={updateCouponMutation.isLoading}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                {updateCouponMutation.isLoading ? 'Updating...' : 'Update Coupon'}
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={resetDeleteForm}
                title={
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <MdDelete className="text-red-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Delete Coupon</h3>
                            <p className="text-sm text-gray-500">This action cannot be undone</p>
                        </div>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-red-600 text-lg">⚠️</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-red-800 mb-1">
                                    Warning: Permanent Deletion
                                </h4>
                                <p className="text-sm text-red-700">
                                    You are about to permanently delete the coupon <strong>"{couponToDelete?.code}"</strong>.
                                    This action cannot be undone and will remove the coupon from your system.
                                </p>
                            </div>
                        </div>
                    </div>

                    {couponToDelete && (
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Coupon Details:</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Code:</span>
                                    <span className="font-medium text-gray-900">{couponToDelete.code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="font-medium text-gray-900">{couponToDelete.discountPercentage}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Expires:</span>
                                    <span className="font-medium text-gray-900">{formatDate(new Date(couponToDelete.expirationDate))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-medium ${couponToDelete.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                        {couponToDelete.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={resetDeleteForm}
                            className="flex-1 py-3 border border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleDelete}
                            loading={deleteCouponMutation.isLoading}
                            className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                        >
                            {deleteCouponMutation.isLoading ? 'Deleting...' : 'Delete Permanently'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageCoupons;
