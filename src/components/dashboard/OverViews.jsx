import React, { useState, useEffect, useMemo } from 'react';
import { MdRefresh } from 'react-icons/md';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Select from '../ui/Select';
import FinancialStatsCards from './overview/FinancialStatsCards';
import BusinessOverview from './overview/BusinessOverview';
import PureSalesChart from './overview/PureSalesChart';
import PureExpensesChart from './overview/PureExpensesChart';
import ExpenseChart from './overview/ExpenseChart';
import ReportActions from './overview/ReportActions';
import { useGetFinancialOverviewQuery, useGetSalesAnalyticsQuery } from '../../redux/api/expenseApi';

const OverViews = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('weekly');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    // Build query parameters based on selection
    const queryParams = useMemo(() => {
        if (dateRange.startDate && dateRange.endDate) {
            // Custom date range takes priority
            return {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                period: 'custom'
            };
        } else {
            // Use period-based filtering
            const params = { period: selectedPeriod };

            if (selectedPeriod === 'monthly') {
                params.year = selectedYear;
                params.month = selectedMonth;
            } else if (selectedPeriod === 'yearly') {
                params.year = selectedYear;
            }

            return params;
        }
    }, [selectedPeriod, selectedMonth, selectedYear, dateRange]);

    // Fetch financial overview data
    const {
        data: financialData,
        isLoading: financialLoading,
        error: financialError,
        refetch: refetchFinancial
    } = useGetFinancialOverviewQuery(queryParams);

    // Fetch sales analytics data
    const {
        data: salesData,
        isLoading: salesLoading,
        error: salesError,
        refetch: refetchSales
    } = useGetSalesAnalyticsQuery(queryParams);

    const periodOptions = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' }
    ];

    // Month options for dropdown
    const monthOptions = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    // Year options (last 5 years + current + next 2)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 8 }, (_, i) => {
        const year = currentYear - 3 + i;
        return { value: year, label: year.toString() };
    });

    // Process chart data for sales trends based on exact backend data
    const chartData = useMemo(() => {
        // Always try to use real backend data first
        if (financialData?.data?.chartData && financialData.data.chartData.length > 0) {
            return financialData.data.chartData.map(item => {
                const sales = item.sales || 0;
                const expenses = item.expenses || 0;
                // Ensure consistent profit calculation
                const profit = sales - expenses;

                let label;
                if (queryParams.period === 'custom') {
                    const date = new Date(item._id.year, item._id.month - 1, item._id.day);
                    label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                } else if (selectedPeriod === 'daily') {
                    label = `${item._id.hour || 0}:00`;
                } else if (selectedPeriod === 'weekly') {
                    const date = new Date(item._id.year, item._id.month - 1, item._id.day);
                    label = date.toLocaleDateString('en-US', { weekday: 'short' });
                } else if (selectedPeriod === 'monthly') {
                    label = new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' });
                } else {
                    label = item._id.year.toString();
                }

                return {
                    year: label,
                    sales,
                    expenses,
                    profit,
                    orders: item.orders || 0,
                    date: new Date(item._id.year, (item._id.month || 1) - 1, item._id.day || 1, item._id.hour || 0)
                };
            }).sort((a, b) => a.date - b.date);
        }

        // Fallback: Use real overview data to create meaningful chart
        const overview = financialData?.data?.overview;
        if (overview && (overview.totalSales > 0 || overview.totalExpenses > 0)) {
            const totalSales = overview.totalSales || 0;
            const totalExpenses = overview.totalExpenses || 0;
            // Ensure consistent calculation
            const profit = totalSales - totalExpenses;

            // Create single data point for current period
            let label = 'Current Period';
            if (selectedPeriod === 'daily') label = 'Today';
            else if (selectedPeriod === 'weekly') label = 'This Week';
            else if (selectedPeriod === 'monthly') label = 'This Month';
            else if (selectedPeriod === 'yearly') label = 'This Year';

            return [{
                year: label,
                sales: totalSales,
                expenses: totalExpenses,
                profit,
                orders: overview.totalOrders || 0,
                date: new Date()
            }];
        }

        // Final fallback: Empty state message
        return [{
            year: 'No Data',
            sales: 0,
            expenses: 0,
            profit: 0,
            orders: 0,
            date: new Date()
        }];
    }, [financialData, selectedPeriod, queryParams]);

    // Process expense breakdown data
    const expenseBreakdown = useMemo(() => {
        if (!financialData?.data?.expensesByCategory) return [];

        const categoryNames = {
            'rawMaterials': 'Raw Materials',
            'utilityBills': 'Utility Bills',
            'others': 'Others'
        };

        return financialData.data.expensesByCategory.map(item => ({
            name: categoryNames[item._id] || item._id,
            value: item.totalAmount,
            count: item.count
        }));
    }, [financialData]);

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
        setDateRange({ startDate: '', endDate: '' }); // Reset custom date range
    };

    const handleDateRangeSubmit = () => {
        if (dateRange.startDate && dateRange.endDate) {
            // Data will automatically refetch due to queryParams dependency
            console.log('Custom date range applied:', dateRange);
        }
    };

    const clearCustomDateRange = () => {
        setDateRange({ startDate: '', endDate: '' });
    };

    // Refresh all data
    const refreshData = () => {
        refetchFinancial();
        refetchSales();
    };

    const overview = financialData?.data?.overview || {};
    const isLoading = financialLoading || salesLoading;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Financial OverViews</h1>
                        <p className="text-gray-600">Sales and Expenses over the Years</p>
                    </div>

                    {/* Refresh Button */}
                    <Button
                        variant="ghost"
                        onClick={refreshData}
                        icon={<MdRefresh />}
                        className="self-start lg:self-center"
                    >
                        Refresh
                    </Button>
                </div>

                {/* Controls Row */}
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                    {/* Period Selector */}
                    <div className="flex gap-2">
                        {periodOptions.map((option) => (
                            <Button
                                key={option.value}
                                variant={selectedPeriod === option.value ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => handlePeriodChange(option.value)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>

                    {/* Month and Year Selectors */}
                    {(selectedPeriod === 'monthly' || selectedPeriod === 'yearly') && (
                        <div className="flex gap-3 items-center">
                            {selectedPeriod === 'monthly' && (
                                <Select
                                    options={monthOptions}
                                    value={selectedMonth}
                                    onChange={setSelectedMonth}
                                    placeholder="Select Month"
                                    className="min-w-[120px]"
                                />
                            )}
                            <Select
                                options={yearOptions}
                                value={selectedYear}
                                onChange={setSelectedYear}
                                placeholder="Select Year"
                                className="min-w-[100px]"
                            />
                        </div>
                    )}

                    {/* Custom Date Range */}
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Custom Range:</span>
                        <div className="flex gap-2 items-center">
                            <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Start date"
                            />
                            <span className="text-gray-500 text-sm">to</span>
                            <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="End date"
                            />
                            <Button
                                size="sm"
                                onClick={handleDateRangeSubmit}
                                disabled={!dateRange.startDate || !dateRange.endDate}
                                variant="primary"
                            >
                                Apply
                            </Button>
                            {(dateRange.startDate || dateRange.endDate) && (
                                <Button
                                    size="sm"
                                    onClick={clearCustomDateRange}
                                    variant="ghost"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            )}

            {/* Financial Stats Cards */}
            <FinancialStatsCards overview={overview} formatCurrency={formatCurrency} />

            {/* Business Overview */}
            <BusinessOverview
                selectedPeriod={selectedPeriod}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                dateRange={dateRange}
                refreshData={refreshData}
            />

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Pure Sales Chart */}
                <PureSalesChart
                    chartData={chartData}
                    formatCurrency={formatCurrency}
                    refreshData={refreshData}
                />

                {/* Pure Expenses Chart */}
                <PureExpensesChart
                    chartData={chartData}
                    formatCurrency={formatCurrency}
                    refreshData={refreshData}
                />
            </div>

            {/* Expense Breakdown Pie Chart */}
            <div className="grid grid-cols-1 gap-6">
                <ExpenseChart
                    expenseBreakdown={expenseBreakdown}
                    formatCurrency={formatCurrency}
                    refreshData={refreshData}
                />
            </div>

            {/* Report Actions */}
            <ReportActions
                financialData={financialData}
                chartData={chartData}
                expenseBreakdown={expenseBreakdown}
                selectedPeriod={selectedPeriod}
                selectedMonth={selectedMonth}
                monthOptions={monthOptions}
                dateRange={dateRange}
                formatCurrency={formatCurrency}
                refreshData={refreshData}
            />
        </div>
    );
};

export default OverViews;
