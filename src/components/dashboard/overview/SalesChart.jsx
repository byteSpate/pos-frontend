import React from 'react';
import { MdRefresh } from 'react-icons/md';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

// Chart colors matching the image
const CHART_COLORS = {
    sales: '#4285F4',     // Blue for sales
    expenses: '#EA4335',  // Red for expenses  
    profit: '#FBBC04',    // Yellow for profit
};

const SalesChart = ({ chartData, formatCurrency, refreshData }) => {
    return (
        <Card className="xl:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sales and Expenses over the Years</h3>
                <Button
                    variant="ghost"
                    onClick={refreshData}
                    icon={<MdRefresh />}
                    size="sm"
                >
                    Refresh
                </Button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#666', fontSize: 12 }}
                        tickFormatter={(value) => `${value}K`}
                    />
                    <Tooltip
                        formatter={(value, name) => [
                            formatCurrency(value),
                            name === 'sales' ? 'Sales' : name === 'expenses' ? 'Expenses' : 'Profit'
                        ]}
                        labelStyle={{ color: '#333' }}
                        contentStyle={{
                            background: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                    />
                    <Bar
                        dataKey="sales"
                        fill={CHART_COLORS.sales}
                        name="Sales"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                    />
                    <Bar
                        dataKey="expenses"
                        fill={CHART_COLORS.expenses}
                        name="Expenses"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                    />
                    <Bar
                        dataKey="profit"
                        fill={CHART_COLORS.profit}
                        name="Profit"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default SalesChart;
