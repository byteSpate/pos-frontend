import React from 'react';
import {
    MdTrendingUp,
    MdTrendingDown,
    MdAttachMoney,
    MdReceipt,
    MdAccountBalance,
    MdShoppingCart
} from 'react-icons/md';
import Card from '../../ui/Card';

const FinancialStatsCards = ({ overview, formatCurrency }) => {
    // Validate and ensure consistent calculations
    const totalSales = overview.totalSales || 0;
    const totalExpenses = overview.totalExpenses || 0;
    const calculatedRevenue = totalSales - totalExpenses;
    const netRevenue = overview.netRevenue !== undefined ? overview.netRevenue : calculatedRevenue;

    // Log any discrepancies for debugging
    if (overview.netRevenue !== undefined && Math.abs(calculatedRevenue - overview.netRevenue) > 0.01) {
        console.warn('Revenue calculation mismatch in stats cards:', {
            calculated: calculatedRevenue,
            stored: overview.netRevenue,
            totalSales,
            totalExpenses
        });
    }

    // Stats cards configuration
    const statsCards = [
        {
            title: 'Total Sales',
            value: totalSales,
            icon: <MdAttachMoney className="w-8 h-8" />,
            color: 'bg-green-500',
            trend: '+12%',
            trendUp: true
        },
        {
            title: 'Total Expenses',
            value: totalExpenses,
            icon: <MdReceipt className="w-8 h-8" />,
            color: 'bg-red-500',
            trend: '-5%',
            trendUp: false
        },
        {
            title: 'Net Revenue',
            value: calculatedRevenue, // Use calculated value for consistency
            icon: <MdAccountBalance className="w-8 h-8" />,
            color: calculatedRevenue >= 0 ? 'bg-blue-500' : 'bg-red-500',
            trend: '+8%',
            trendUp: calculatedRevenue >= 0
        },
        {
            title: 'Total Orders',
            value: overview.totalOrders || 0,
            icon: <MdShoppingCart className="w-8 h-8" />,
            color: 'bg-purple-500',
            trend: '+15%',
            trendUp: true,
            isCount: true
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
                <Card key={index} className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stat.isCount ? stat.value.toLocaleString() : formatCurrency(stat.value)}
                            </p>
                            <div className="flex items-center mt-2">
                                {stat.trendUp ? (
                                    <MdTrendingUp className="w-4 h-4 text-green-500" />
                                ) : (
                                    <MdTrendingDown className="w-4 h-4 text-red-500" />
                                )}
                                <span className={`text-sm ml-1 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.trend}
                                </span>
                                <span className="text-sm text-gray-500 ml-1">vs last period</span>
                            </div>
                        </div>
                        <div className={`${stat.color} text-white p-3 rounded-lg`}>
                            {stat.icon}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default FinancialStatsCards;
