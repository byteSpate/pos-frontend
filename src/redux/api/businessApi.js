import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = 'http://localhost:8000/api';

export const businessApi = createApi({
    reducerPath: 'businessApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        credentials: 'include', // Include cookies for authentication
    }),
    tagTypes: ['Tables', 'Orders', 'BusinessStats'],
    endpoints: (builder) => ({
        // Get all tables
        getTables: builder.query({
            query: () => '/table',
            providesTags: ['Tables'],
        }),

        // Get all orders
        getOrders: builder.query({
            query: (filters = {}) => {
                const queryParams = new URLSearchParams();
                if (filters.status) queryParams.append('status', filters.status);
                if (filters.startDate) queryParams.append('startDate', filters.startDate);
                if (filters.endDate) queryParams.append('endDate', filters.endDate);
                if (filters.page) queryParams.append('page', filters.page);
                if (filters.limit) queryParams.append('limit', filters.limit);

                return `/order?${queryParams}`;
            },
            providesTags: ['Orders'],
        }),

        // Get menu statistics
        getMenuStats: builder.query({
            query: () => '/menu/stats',
            providesTags: ['BusinessStats'],
        }),

        // Get table statistics
        getTableStats: builder.query({
            query: () => '/table/stats',
            providesTags: ['BusinessStats'],
        }),

        // Get order statistics
        getOrderStats: builder.query({
            query: (filters = {}) => {
                const queryParams = new URLSearchParams();
                if (filters.period) queryParams.append('period', filters.period);
                if (filters.startDate) queryParams.append('startDate', filters.startDate);
                if (filters.endDate) queryParams.append('endDate', filters.endDate);
                if (filters.month) queryParams.append('month', filters.month);
                if (filters.year) queryParams.append('year', filters.year);

                return `/order/stats?${queryParams}`;
            },
            providesTags: ['BusinessStats'],
        }),
    }),
});

export const {
    useGetTablesQuery,
    useGetOrdersQuery,
    useGetMenuStatsQuery,
    useGetTableStatsQuery,
    useGetOrderStatsQuery,
} = businessApi;
