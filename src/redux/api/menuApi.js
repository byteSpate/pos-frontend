import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = 'http://localhost:8000/api';

export const menuApi = createApi({
  reducerPath: 'menuApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include', // Include cookies for authentication
  }),
  tagTypes: ['Menu', 'Categories'],
  endpoints: (builder) => ({
    // Get all menu items
    getMenuItems: builder.query({
      query: (filters = {}) => {
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.available !== undefined) queryParams.append('available', filters.available);
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.page) queryParams.append('page', filters.page);
        if (filters.limit) queryParams.append('limit', filters.limit);

        return `/menu?${queryParams}`;
      },
      providesTags: ['Menu'],
    }),

    // Get menu categories
    getMenuCategories: builder.query({
      query: () => '/menu/categories',
      providesTags: ['Categories'],
    }),

    // Get single menu item
    getMenuItemById: builder.query({
      query: (id) => `/menu/${id}`,
      providesTags: (result, error, id) => [{ type: 'Menu', id }],
    }),

    // Add new menu item
    addMenuItem: builder.mutation({
      query: (formData) => ({
        url: '/menu',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Menu', 'Categories'],
    }),

    // Update menu item
    updateMenuItem: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/menu/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Menu', id },
        'Menu',
        'Categories'
      ],
    }),

    // Delete menu item
    deleteMenuItem: builder.mutation({
      query: (id) => ({
        url: `/menu/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Menu', 'Categories'],
    }),
  }),
});

export const {
  useGetMenuItemsQuery,
  useGetMenuCategoriesQuery,
  useGetMenuItemByIdQuery,
  useAddMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuApi;
