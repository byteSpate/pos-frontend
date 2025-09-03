import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdArrowBack, MdSave, MdCalculate, MdHistory } from 'react-icons/md';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const EditExpense = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [expense, setExpense] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        amountPerUnit: '',
        category: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [originalData, setOriginalData] = useState({});

    const categoryOptions = [
        { value: 'rawMaterials', label: 'Raw Materials' },
        { value: 'utilityBills', label: 'Utility Bills' },
        { value: 'others', label: 'Others' }
    ];

    useEffect(() => {
        document.title = "Kacchi Express | Edit Expense";

        // Get expense from location state or fetch by ID
        if (location.state?.expense) {
            const exp = location.state.expense;
            setExpense(exp);
            const initialData = {
                title: exp.title || '',
                amount: exp.amount?.toString() || '',
                amountPerUnit: exp.amountPerUnit?.toString() || '',
                category: exp.category || '',
                description: exp.description || ''
            };
            setFormData(initialData);
            setOriginalData(initialData);
        } else {
            // Redirect back if no expense data
            navigate('/dashboard/expenses');
        }
    }, [location.state, navigate]);

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

        setLoading(true);
        try {
            const response = await fetch(`/api/expense/${expense._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: formData.title.trim(),
                    amount: parseFloat(formData.amount),
                    amountPerUnit: formData.amountPerUnit ? parseFloat(formData.amountPerUnit) : null,
                    category: formData.category,
                    description: formData.description.trim() || undefined
                })
            });

            if (response.ok) {
                navigate('/dashboard/expenses', {
                    state: { message: 'Expense updated successfully!' }
                });
            } else {
                const data = await response.json();
                console.error('Failed to update expense:', data.message);
                setErrors({ submit: data.message || 'Failed to update expense' });
            }
        } catch (error) {
            console.error('Error updating expense:', error);
            setErrors({ submit: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
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

    const calculateOriginalTotal = () => {
        const amount = parseFloat(originalData.amount) || 0;
        const amountPerUnit = parseFloat(originalData.amountPerUnit) || 0;

        if (amountPerUnit > 0) {
            return amount * amountPerUnit;
        }
        return amount;
    };

    const hasChanges = () => {
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    };

    const handleCancel = () => {
        if (hasChanges()) {
            if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                navigate('/dashboard/expenses');
            }
        } else {
            navigate('/dashboard/expenses');
        }
    };

    if (!expense) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading expense...</p>
                </div>
            </div>
        );
    }

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
                            <h1 className="text-3xl font-bold text-gray-900">Edit Expense</h1>
                            <p className="text-gray-600 mt-1">
                                Update expense details and information
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
                                        placeholder="Enter expense title"
                                        error={errors.title}
                                        className="text-lg"
                                    />
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
                                            Additional context or notes about this expense
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
                                        disabled={loading}
                                        className="px-6"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        loading={loading}
                                        disabled={loading || !hasChanges()}
                                        icon={<MdSave />}
                                        className="bg-blue-600 hover:bg-blue-700 px-6"
                                    >
                                        {loading ? 'Updating...' : 'Update Expense'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Current Summary */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MdCalculate className="mr-2" />
                                Updated Summary
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
                                    <div className="text-sm text-blue-600 mb-1">New Total Amount</div>
                                    <div className="text-2xl font-bold text-blue-700">
                                        ৳{calculateTotalAmount().toLocaleString()}
                                    </div>
                                    {formData.amountPerUnit && formData.amount && (
                                        <div className="text-xs text-blue-600 mt-1">
                                            {formData.amount} × {formData.amountPerUnit} = {calculateTotalAmount()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Original vs New Comparison */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MdHistory className="mr-2" />
                                Changes Summary
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-sm text-gray-600">Original Total:</span>
                                    <span className="font-medium">৳{calculateOriginalTotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-sm text-gray-600">New Total:</span>
                                    <span className="font-medium">৳{calculateTotalAmount().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-600">Difference:</span>
                                    <span className={`font-bold ${calculateTotalAmount() - calculateOriginalTotal() >= 0
                                        ? 'text-red-600'
                                        : 'text-green-600'
                                        }`}>
                                        {calculateTotalAmount() - calculateOriginalTotal() >= 0 ? '+' : ''}
                                        ৳{(calculateTotalAmount() - calculateOriginalTotal()).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {!hasChanges() && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600">No changes made</p>
                                </div>
                            )}
                        </Card>

                        {/* Expense Info */}
                        <Card className="p-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Expense Info</h3>
                            <div className="space-y-2 text-xs text-gray-600">
                                <div>
                                    <span className="font-medium">Created:</span>{' '}
                                    {new Date(expense.createdAt).toLocaleDateString()}
                                </div>
                                <div>
                                    <span className="font-medium">Last Updated:</span>{' '}
                                    {new Date(expense.updatedAt).toLocaleDateString()}
                                </div>
                                <div>
                                    <span className="font-medium">ID:</span>{' '}
                                    {expense._id}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditExpense;
