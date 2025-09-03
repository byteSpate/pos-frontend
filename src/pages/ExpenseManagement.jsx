import React, { useState, useEffect } from 'react';
import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdSearch,
    MdCalendarToday,
    MdAttachMoney,
    MdCategory,
    MdArrowBack
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useGetExpensesQuery, useDeleteExpenseMutation } from '../redux/api/expenseApi';

const ExpenseManagement = () => {
    const navigate = useNavigate();
    const [deleteExpense] = useDeleteExpenseMutation();
    const [filters, setFilters] = useState({
        category: '',
        startDate: '',
        endDate: '',
        search: '',
        page: 1,
        limit: 10
    });

    const {
        data: expenseData,
        isLoading,
        error,
        refetch
    } = useGetExpensesQuery(filters);

    const categoryOptions = [
        { value: '', label: 'All Categories' },
        { value: 'rawMaterials', label: 'Raw Materials' },
        { value: 'utilityBills', label: 'Utility Bills' },
        { value: 'others', label: 'Others' }
    ];

    // Process the data from RTK Query
    const expenses = expenseData?.data || [];
    const pagination = expenseData?.pagination || { page: 1, limit: 10, total: 0, pages: 0 };
    const totalAmount = expenseData?.totalAmount || 0;

    // Filter expenses on client side for search
    const filteredExpenses = filters.search
        ? expenses.filter(expense =>
            expense.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            expense.description?.toLowerCase().includes(filters.search.toLowerCase())
        )
        : expenses;

    useEffect(() => {
        document.title = "Kacchi Express | Expense Management";
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: key !== 'page' ? 1 : value // Reset to page 1 unless changing page
        }));
    };

    const handleEdit = (expense) => {
        navigate('/dashboard/expenses/edit', { state: { expense } });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await deleteExpense(id).unwrap();
                // RTK Query will automatically refetch the data
            } catch (error) {
                console.error('Error deleting expense:', error);
            }
        }
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const getCategoryDisplay = (category) => {
        const categoryMap = {
            'rawMaterials': 'Raw Materials',
            'utilityBills': 'Utility Bills',
            'others': 'Others'
        };
        return categoryMap[category] || category;
    };

    const getCategoryColor = (category) => {
        const colorMap = {
            'rawMaterials': 'bg-blue-100 text-blue-800',
            'utilityBills': 'bg-green-100 text-green-800',
            'others': 'bg-gray-100 text-gray-800'
        };
        return colorMap[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/dashboard')}
                            icon={<MdArrowBack />}
                            className="mr-4"
                        >
                            Back to Dashboard
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
                            <p className="text-gray-600 mt-1">
                                Track and manage all business expenses
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={() => navigate('/dashboard/expenses/add')}
                            icon={<MdAdd />}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Add New Expense
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                                <p className="text-2xl font-bold text-gray-900">৳{totalAmount.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <MdAttachMoney className="text-red-600 text-xl" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Items</p>
                                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <MdCategory className="text-blue-600 text-xl" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">This Month</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ৳{expenses.filter(e => {
                                        const expenseDate = new Date(e.createdAt);
                                        const now = new Date();
                                        return expenseDate.getMonth() === now.getMonth() &&
                                            expenseDate.getFullYear() === now.getFullYear();
                                    }).reduce((sum, e) => sum + e.totalAmount, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <MdCalendarToday className="text-green-600 text-xl" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <Input
                                type="text"
                                placeholder="Search expenses..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                icon={<MdSearch />}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <Select
                                options={categoryOptions}
                                value={filters.category}
                                onChange={(value) => handleFilterChange('category', value)}
                                placeholder="Select category"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <Input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <Input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                {/* Expenses Table */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses List</h3>

                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="mt-2 text-gray-600">Loading expenses...</p>
                            </div>
                        ) : filteredExpenses.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">No expenses found</p>
                                <Button
                                    onClick={() => navigate('/dashboard/expenses/add')}
                                    icon={<MdAdd />}
                                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                                >
                                    Add Your First Expense
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Title
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredExpenses.map((expense) => (
                                                <tr key={expense._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {expense.title}
                                                            </div>
                                                            {expense.description && (
                                                                <div className="text-sm text-gray-500">
                                                                    {expense.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                                                            {getCategoryDisplay(expense.category)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        ৳{expense.amount.toLocaleString()}
                                                        {expense.amountPerUnit && (
                                                            <div className="text-xs text-gray-500">
                                                                × {expense.amountPerUnit}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        ৳{expense.totalAmount.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(expense.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => handleEdit(expense)}
                                                                className="text-blue-600 hover:text-blue-900 p-1"
                                                                title="Edit expense"
                                                            >
                                                                <MdEdit className="text-lg" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(expense._id)}
                                                                className="text-red-600 hover:text-red-900 p-1"
                                                                title="Delete expense"
                                                            >
                                                                <MdDelete className="text-lg" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="flex items-center justify-between mt-6">
                                        <div className="text-sm text-gray-700">
                                            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                            {pagination.total} results
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handlePageChange(pagination.page - 1)}
                                                disabled={pagination.page === 1}
                                            >
                                                Previous
                                            </Button>
                                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={page === pagination.page ? "primary" : "ghost"}
                                                    onClick={() => handlePageChange(page)}
                                                    className="w-10 h-10"
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                            <Button
                                                variant="ghost"
                                                onClick={() => handlePageChange(pagination.page + 1)}
                                                disabled={pagination.page === pagination.pages}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ExpenseManagement;
