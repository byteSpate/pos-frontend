import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSave, MdCalculate } from 'react-icons/md';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useCreateExpenseMutation } from '../redux/api/expenseApi';

const AddExpense = () => {
    const navigate = useNavigate();
    const [createExpense, { isLoading }] = useCreateExpenseMutation();
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        amountPerUnit: '',
        category: '',
        description: ''
    });
    const [errors, setErrors] = useState({});

    const categoryOptions = [
        { value: 'rawMaterials', label: 'Raw Materials' },
        { value: 'utilityBills', label: 'Utility Bills' },
        { value: 'others', label: 'Others' }
    ];

    useEffect(() => {
        document.title = "Kacchi Express | Add Expense";
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if (formData.amountPerUnit && formData.amountPerUnit <= 0) {
            newErrors.amountPerUnit = 'Amount per unit must be greater than 0';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const expenseData = {
                title: formData.title.trim(),
                amount: parseFloat(formData.amount),
                amountPerUnit: formData.amountPerUnit ? parseFloat(formData.amountPerUnit) : null,
                category: formData.category,
                description: formData.description.trim() || undefined
            };

            const result = await createExpense(expenseData).unwrap();

            // Success - navigate to expenses list
            navigate('/dashboard/expenses', {
                state: { message: 'Expense created successfully!' }
            });
        } catch (error) {
            console.error('Error creating expense:', error);

            // Handle RTK Query errors
            let errorMessage = 'Failed to create expense';

            if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (error?.status) {
                errorMessage = `Server error: ${error.status}`;
            }

            setErrors({ submit: errorMessage });
        }
    };

    const calculateTotalAmount = () => {
        const amount = parseFloat(formData.amount) || 0;
        const amountPerUnit = parseFloat(formData.amountPerUnit) || 0;

        if (amountPerUnit > 0) {
            return amount * amountPerUnit;
        }
        return amount;
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            navigate('/dashboard/expenses');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/dashboard/expenses')}
                            icon={<MdArrowBack />}
                            className="mr-4"
                        >
                            Back to Expenses
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Add New Expense</h1>
                            <p className="text-gray-600 mt-1">
                                Create a new expense entry for your business
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Expense Title *
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Enter expense title (e.g., Office Supplies, Electricity Bill)"
                                        error={errors.title}
                                        className="text-lg"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Provide a clear, descriptive title for this expense
                                    </p>
                                </div>

                                {/* Amount and Amount Per Unit */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Amount *
                                        </label>
                                        <Input
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => handleInputChange('amount', e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            error={errors.amount}
                                            className="text-lg"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Base amount or unit price
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantity/Units (Optional)
                                        </label>
                                        <Input
                                            type="number"
                                            value={formData.amountPerUnit}
                                            onChange={(e) => handleInputChange('amountPerUnit', e.target.value)}
                                            placeholder="1"
                                            min="0"
                                            step="0.01"
                                            error={errors.amountPerUnit}
                                            className="text-lg"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Number of units or quantity purchased
                                        </p>
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <Select
                                        options={categoryOptions}
                                        value={formData.category}
                                        onChange={(value) => handleInputChange('category', value)}
                                        placeholder="Select expense category"
                                        error={errors.category}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Choose the most appropriate category for this expense
                                    </p>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Enter additional details about this expense..."
                                        rows={4}
                                        maxLength={500}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-xs text-gray-500">
                                            Provide additional context or notes about this expense
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {formData.description.length}/500
                                        </p>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {errors.submit && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                        <strong>Error:</strong> {errors.submit}
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className="px-6"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        loading={isLoading}
                                        disabled={isLoading}
                                        icon={<MdSave />}
                                        className="bg-blue-600 hover:bg-blue-700 px-6"
                                    >
                                        {isLoading ? 'Creating...' : 'Create Expense'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MdCalculate className="mr-2" />
                                Expense Summary
                            </h3>

                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">Base Amount</div>
                                    <div className="text-xl font-semibold text-gray-900">
                                        ৳{formData.amount ? parseFloat(formData.amount).toLocaleString() : '0.00'}
                                    </div>
                                </div>

                                {formData.amountPerUnit && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-600 mb-1">Quantity</div>
                                        <div className="text-xl font-semibold text-gray-900">
                                            {parseFloat(formData.amountPerUnit).toLocaleString()} units
                                        </div>
                                    </div>
                                )}

                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <div className="text-sm text-blue-600 mb-1">Total Amount</div>
                                    <div className="text-2xl font-bold text-blue-700">
                                        ৳{calculateTotalAmount().toLocaleString()}
                                    </div>
                                    {formData.amountPerUnit && formData.amount && (
                                        <div className="text-xs text-blue-600 mt-1">
                                            {formData.amount} × {formData.amountPerUnit} = {calculateTotalAmount()}
                                        </div>
                                    )}
                                </div>

                                {formData.category && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-600 mb-1">Category</div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {categoryOptions.find(opt => opt.value === formData.category)?.label}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t text-xs text-gray-500">
                                <p><strong>Note:</strong> This expense will be automatically included in your revenue calculations and financial reports.</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddExpense;
