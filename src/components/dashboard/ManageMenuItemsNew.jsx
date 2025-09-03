import React, { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { MdAdd, MdRestaurantMenu, MdUpload, MdClose, MdEdit, MdDelete } from 'react-icons/md';
import {
    useGetMenuItemsQuery,
    useAddMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation
} from '../../redux/api/menuApi';
import Button from '../ui/Button';
import Modal from '../shared/Modal';
import MenuFilterSection from './MenuFilterSection';
import MenuTable, { MenuEmptyState } from './MenuTable';
import MenuPagination from './MenuPagination';

const ManageMenuItems = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        price: '',
        description: '',
        isAvailable: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // RTK Query hooks
    const { data: menuData = { data: [] }, isLoading } = useGetMenuItemsQuery({
        search: searchTerm,
        category: selectedCategory
    });
    const [addMenuItem, { isLoading: isAdding }] = useAddMenuItemMutation();
    const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation();
    const [deleteMenuItem, { isLoading: isDeleting }] = useDeleteMenuItemMutation();

    const categories = [
        'All', 'Biriyani', 'Rice Items', 'Fish Items', 'Chicken Items',
        'Beef Items', 'Mutton Items', 'Drinks', 'Fast Foods'
    ];

    // Handlers
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                enqueueSnackbar('Please select a valid image file', { variant: 'error' });
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                enqueueSnackbar('Image size should be less than 5MB', { variant: 'error' });
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: '',
            price: '',
            description: '',
            isAvailable: true
        });
        setImageFile(null);
        setImagePreview(null);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            enqueueSnackbar('Please select an image for the dish', { variant: 'error' });
            return;
        }
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('isAvailable', formData.isAvailable);
            formDataToSend.append('image', imageFile);
            await addMenuItem(formDataToSend).unwrap();
            enqueueSnackbar('Dish added successfully!', { variant: 'success' });
            setShowCreateModal(false);
            resetForm();
        } catch (error) {
            enqueueSnackbar(error.data?.message || 'Failed to add dish', { variant: 'error' });
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', editingItem.title);
            formDataToSend.append('category', editingItem.category);
            formDataToSend.append('price', editingItem.price);
            formDataToSend.append('description', editingItem.description || '');
            formDataToSend.append('isAvailable', editingItem.isAvailable);
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }
            await updateMenuItem({ id: editingItem._id, formData: formDataToSend }).unwrap();
            enqueueSnackbar('Item updated successfully!', { variant: 'success' });
            setShowEditModal(false);
            setEditingItem(null);
            resetForm();
        } catch (error) {
            enqueueSnackbar('Failed to update item', { variant: 'error' });
        }
    };

    const toggleAvailability = async (item) => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', item.title);
            formDataToSend.append('category', item.category);
            formDataToSend.append('price', item.price);
            formDataToSend.append('description', item.description || '');
            formDataToSend.append('isAvailable', !item.isAvailable);
            await updateMenuItem({ id: item._id, formData: formDataToSend }).unwrap();
            enqueueSnackbar(`Item ${!item.isAvailable ? 'shown' : 'hidden'} successfully!`, { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to update availability', { variant: 'error' });
        }
    };

    const openDeleteModal = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await deleteMenuItem(itemToDelete._id).unwrap();
            enqueueSnackbar('Item deleted successfully!', { variant: 'success' });
            setShowDeleteModal(false);
            setItemToDelete(null);
        } catch (error) {
            enqueueSnackbar('Failed to delete item', { variant: 'error' });
        }
    };

    // Filter and pagination logic
    const allFilteredItems = menuData.data?.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || item.category === selectedCategory;
        const matchesAvailability = availabilityFilter === '' ||
            (availabilityFilter === 'available' && item.isAvailable) ||
            (availabilityFilter === 'unavailable' && !item.isAvailable);
        return matchesSearch && matchesCategory && matchesAvailability;
    }) || [];

    const totalPages = Math.ceil(allFilteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const filteredItems = allFilteredItems.slice(startIndex, endIndex);

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, availabilityFilter]);

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setAvailabilityFilter('');
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <MenuFilterSection
                    searchTerm=""
                    setSearchTerm={() => { }}
                    selectedCategory=""
                    setSelectedCategory={() => { }}
                    availabilityFilter=""
                    setAvailabilityFilter={() => { }}
                    categories={categories}
                    itemCount={0}
                />
                <MenuTable items={[]} isLoading={true} />
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
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                                <MdRestaurantMenu className="text-white text-xl" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Manage Menu Items
                            </h1>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base">
                            View, edit, and manage your restaurant menu with ease
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                {allFilteredItems.filter(item => item.isAvailable).length} Available
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                {allFilteredItems.filter(item => !item.isAvailable).length} Unavailable
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                {allFilteredItems.length} Total Items
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setShowCreateModal(true)}
                        icon={<MdAdd />}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    >
                        Add Dish
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <MenuFilterSection
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                availabilityFilter={availabilityFilter}
                setAvailabilityFilter={setAvailabilityFilter}
                categories={categories}
                itemCount={allFilteredItems.length}
            />

            {/* Table and Empty State */}
            {allFilteredItems.length === 0 ? (
                <MenuEmptyState
                    searchTerm={searchTerm}
                    selectedCategory={selectedCategory}
                    availabilityFilter={availabilityFilter}
                    onClearFilters={clearAllFilters}
                    onAddItem={() => setShowCreateModal(true)}
                />
            ) : (
                <>
                    <MenuTable
                        items={filteredItems}
                        isLoading={false}
                        onEdit={handleEdit}
                        onToggleAvailability={toggleAvailability}
                        onDelete={openDeleteModal}
                    />
                    <MenuPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        totalItems={allFilteredItems.length}
                    />
                </>
            )}

            {/* Modals */}
            {/* Create Dish Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    resetForm();
                }}
                title={
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <MdAdd className="text-blue-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Add New Dish</h3>
                            <p className="text-sm text-gray-500">Create a delicious menu item</p>
                        </div>
                    </div>
                }
            >
                <form onSubmit={handleCreateSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 mb-3 text-sm font-semibold">
                            Dish Image <span className="text-red-500">*</span>
                        </label>
                        {!imagePreview ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <MdUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <p className="text-gray-600 mb-2">Click to upload dish image</p>
                                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                </label>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-xl"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <MdClose className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-3 text-sm font-semibold">
                                Dish Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter dish name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-3 text-sm font-semibold">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.slice(1).map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-3 text-sm font-semibold">
                            Price (৳) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">৳</span>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-3 text-sm font-semibold">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Describe your delicious dish..."
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <label htmlFor="isAvailable" className="text-sm font-semibold text-gray-700 cursor-pointer">
                                    Available for Order
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    Make this dish available for customers to order
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isAvailable"
                                    id="isAvailable"
                                    checked={formData.isAvailable}
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
                            onClick={() => {
                                setShowCreateModal(false);
                                resetForm();
                            }}
                            className="flex-1 py-3 border border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isAdding}
                            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                        >
                            {isAdding ? 'Adding...' : 'Add Dish'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                    resetForm();
                }}
                title={
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <MdEdit className="text-blue-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Edit Menu Item</h3>
                            <p className="text-sm text-gray-500">Update item details</p>
                        </div>
                    </div>
                }
            >
                {editingItem && (
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 mb-3 text-sm font-semibold">
                                    Dish Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editingItem.title}
                                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-3 text-sm font-semibold">
                                    Price (৳) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={editingItem.price}
                                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Available for Order</label>
                                    <p className="text-xs text-gray-500 mt-1">Toggle availability status</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editingItem.isAvailable}
                                        onChange={(e) => setEditingItem({ ...editingItem, isAvailable: e.target.checked })}
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
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingItem(null);
                                    resetForm();
                                }}
                                className="flex-1 py-3 border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isUpdating}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                {isUpdating ? 'Updating...' : 'Update Item'}
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                }}
                title={
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <MdDelete className="text-red-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Delete Menu Item</h3>
                            <p className="text-sm text-gray-500">This action cannot be undone</p>
                        </div>
                    </div>
                }
            >
                {itemToDelete && (
                    <div className="space-y-6">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-sm text-red-700">
                                Are you sure you want to delete <strong>"{itemToDelete.title}"</strong>?
                                This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setItemToDelete(null);
                                }}
                                className="flex-1 py-3 border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleDelete}
                                loading={isDeleting}
                                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageMenuItems;
