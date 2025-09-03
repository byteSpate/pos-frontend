const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers for JSON requests
const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json'
  };
};

// Helper function to get auth headers for FormData (no Content-Type needed)
const getAuthHeadersForFormData = () => {
  return {};
};

// Add new menu item
export const addMenuItem = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: getAuthHeadersForFormData(),
      credentials: 'include',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to add menu item');
    }
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

// Get all menu items with optional filters
export const getMenuItems = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.available !== undefined) queryParams.append('available', filters.available);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const response = await fetch(`${API_BASE_URL}/menu?${queryParams}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    const data = await response.json();
    
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to fetch menu items');
    }
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

// Get menu categories
export const getMenuCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu/categories`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch categories');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get single menu item
export const getMenuItemById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch menu item');
    }
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw error;
  }
};
