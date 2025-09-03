import React, { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { MdUpload, MdClose, MdImage, MdAdd, MdRefresh } from 'react-icons/md';
import { BiSolidDish } from 'react-icons/bi';
import { useAddMenuItemMutation } from '../../redux/api/menuApi';
import Button from '../ui/Button';

const AddDishes = () => {
  const [addMenuItem, { isLoading }] = useAddMenuItemMutation();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    isAvailable: true
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // CATEGORY
  const categories = [
    'Biriyani', 'Rice Items', 'Fish Items', 'Chicken Items',
    'Beef Items', 'Mutton Items', 'Drinks', 'Fast Foods',

  ];

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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        enqueueSnackbar('Please select a valid image file', { variant: 'error' });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar('Image size should be less than 5MB', { variant: 'error' });
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
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

  const handleSubmit = async (e) => {
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

      const result = await addMenuItem(formDataToSend).unwrap();

      enqueueSnackbar('Dish added successfully!', { variant: 'success' });
      resetForm();
    } catch (error) {
      console.error('Error adding dish:', error);
      enqueueSnackbar(error.data?.message || 'Failed to add dish. Please try again.', { variant: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Dish</h2>
          <p className="text-gray-600">Create a delicious menu item for your restaurant</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              {/* Dish Title */}
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Dish Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter dish name"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Price (৳) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe your dish..."
                />
              </div>

              {/* Availability */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-700">
                  Available for ordering
                </label>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Dish Image *
                </label>

                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <MdImage className="mx-auto text-4xl text-gray-400 mb-4" />
                      <div className="text-lg font-medium text-gray-700 mb-2">
                        Upload Dish Image
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        PNG, JPG, WEBP up to 5MB
                      </div>
                      <Button
                        type="button"
                        variant="primary"
                        icon={<MdUpload />}
                        className="pointer-events-none"
                      >
                        Choose File
                      </Button>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <MdClose className="text-lg" />
                    </button>
                  </div>
                )}
              </div>

              {imageFile && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">File Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Name:</span> {imageFile.name}</p>
                    <p><span className="font-medium">Size:</span> {(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p><span className="font-medium">Type:</span> {imageFile.type}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={resetForm}
              icon={<MdRefresh />}
              className="flex-1"
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              icon={<MdAdd />}
              className="flex-1"
            >
              Add Dish to Menu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDishes;
