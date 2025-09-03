import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = 'http://localhost:8000/api';

export const expenseApi = createApi({
    reducerPath: 'expenseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        credentials: 'include', // Include cookies for authentication
    }),
    tagTypes: ['Expense', 'Revenue', 'ExpenseStats'],
    endpoints: (builder) => ({
        // Get all expenses
        getExpenses: builder.query({
            query: (filters = {}) => {
                const queryParams = new URLSearchParams();
                if (filters.category) queryParams.append('category', filters.category);
                if (filters.startDate) queryParams.append('startDate', filters.startDate);
                if (filters.endDate) queryParams.append('endDate', filters.endDate);
                if (filters.page) queryParams.append('page', filters.page);
                if (filters.limit) queryParams.append('limit', filters.limit);

                return `/expense?${queryParams}`;
            },
            providesTags: ['Expense'],
        }),

        // Get single expense
        getExpenseById: builder.query({
            query: (id) => `/expense/${id}`,
            providesTags: (result, error, id) => [{ type: 'Expense', id }],
        }),

        // Create new expense
        createExpense: builder.mutation({
            query: (expenseData) => ({
                url: '/expense',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseData),
            }),
            invalidatesTags: ['Expense', 'Revenue', 'ExpenseStats'],
        }),

        // Update expense
        updateExpense: builder.mutation({
            query: ({ id, expenseData }) => ({
                url: `/expense/${id}`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseData),
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Expense', id },
                'Expense',
                'Revenue',
                'ExpenseStats'
            ],
        }),

        // Delete expense
        deleteExpense: builder.mutation({
            query: (id) => ({
                url: `/expense/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Expense', 'Revenue', 'ExpenseStats'],
        }),

        // Get expense statistics
        getExpenseStats: builder.query({
            query: (filters = {}) => {
                const queryParams = new URLSearchParams();
                if (filters.startDate) queryParams.append('startDate', filters.startDate);
                if (filters.endDate) queryParams.append('endDate', filters.endDate);

                return `/expense/stats?${queryParams}`;
            },
            providesTags: ['ExpenseStats'],
        }),

        // Calculate revenue
        getRevenue: builder.query({
            query: (filters = {}) => {
                const queryParams = new URLSearchParams();
                if (filters.startDate) queryParams.append('startDate', filters.startDate);
                if (filters.endDate) queryParams.append('endDate', filters.endDate);

                return `/expense/revenue?${queryParams}`;
            },
            providesTags: ['Revenue'],
        }),

        // Generate daily report
        getDailyReport: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                if (params.date) queryParams.append('date', params.date);

                return `/report/daily?${queryParams}`;
            },
            providesTags: ['Revenue'],
        }),

        // Generate weekly report
        getWeeklyReport: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                if (params.date) queryParams.append('date', params.date);

                return `/report/weekly?${queryParams}`;
            },
            providesTags: ['Revenue'],
        }),

        // Generate monthly report
        getMonthlyReport: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                if (params.year) queryParams.append('year', params.year);
                if (params.month) queryParams.append('month', params.month);

                return `/report/monthly?${queryParams}`;
            },
            providesTags: ['Revenue'],
        }),

        // Get sales analytics
        getSalesAnalytics: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                if (params.period) queryParams.append('period', params.period);
                if (params.startDate) queryParams.append('startDate', params.startDate);
                if (params.endDate) queryParams.append('endDate', params.endDate);

                return `/payment/analytics?${queryParams}`;
            },
            providesTags: ['Revenue'],
        }),

        // Get detailed financial overview
        getFinancialOverview: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                if (params.period) queryParams.append('period', params.period);
                if (params.startDate) queryParams.append('startDate', params.startDate);
                if (params.endDate) queryParams.append('endDate', params.endDate);

                return `/expense/financial-overview?${queryParams}`;
            },
            providesTags: ['Revenue', 'ExpenseStats'],
        }),
    }),
});

export const {
    useGetExpensesQuery,
    useGetExpenseByIdQuery,
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,
    useGetExpenseStatsQuery,
    useGetRevenueQuery,
    useGetDailyReportQuery,
    useGetWeeklyReportQuery,
    useGetMonthlyReportQuery,
    useGetSalesAnalyticsQuery,
    useGetFinancialOverviewQuery,
} = expenseApi;
