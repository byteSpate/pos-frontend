import React from 'react';
import { MdRefresh } from 'react-icons/md';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const PIE_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#9AA0A6', '#FF6D01'];

const ExpenseChart = ({ expenseBreakdown, formatCurrency, refreshData }) => {
    const hasData = expenseBreakdown && expenseBreakdown.length > 0;

    const chartData = hasData ? expenseBreakdown : [
        { name: 'Raw Materials', value: 1000 },
        { name: 'Utility Bills', value: 800 },
        { name: 'Others', value: 400 }
    ];

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Expense Categories</h3>
                <Button
                    variant="ghost"
                    onClick={refreshData}
                    icon={<MdRefresh />}
                    size="sm"
                >
                    Refresh
                </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{
                            background: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '8px'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Expense Details */}
            {hasData && (
                <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Expense Details</h4>
                    <div className="space-y-3">
                        {expenseBreakdown.map((category, index) => (
                            <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div
                                        className="w-4 h-4 rounded-full mr-3"
                                        style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                                    ></div>
                                    <div>
                                        <p className="font-medium text-gray-900">{category.name}</p>
                                        <p className="text-sm text-gray-500">{category.count} expenses</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{formatCurrency(category.value)}</p>
                                    <p className="text-sm text-gray-500">
                                        Avg: {formatCurrency(category.value / category.count)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default ExpenseChart;
