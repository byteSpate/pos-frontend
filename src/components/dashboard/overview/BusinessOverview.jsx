import React from 'react';
import {
    MdCategory,
    MdRestaurant,
    MdShoppingCart,
    MdTableBar,
    MdTrendingUp,
    MdTrendingDown,
    MdRefresh
} from 'react-icons/md';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import {
    useGetMenuStatsQuery,
    useGetTableStatsQuery,
    useGetOrderStatsQuery
} from '../../../redux/api/businessApi';

const BusinessOverview = ({ selectedPeriod, selectedMonth, selectedYear, dateRange, refreshData }) => {
    // Build query parameters for order stats based on period and date filters
    const orderQueryParams = React.useMemo(() => {
        if (dateRange.startDate && dateRange.endDate) {
            return {
                period: 'custom',
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            };
        } else {
            const params = { period: selectedPeriod };
            if (selectedPeriod === 'monthly' && selectedMonth && selectedYear) {
                params.month = selectedMonth;
                params.year = selectedYear;
            } else if (selectedPeriod === 'yearly' && selectedYear) {
                params.year = selectedYear;
            }
            return params;
        }
    }, [selectedPeriod, selectedMonth, selectedYear, dateRange]);

    // Fetch business statistics
    const {
        data: menuStats,
        isLoading: menuLoading,
        refetch: refetchMenu
    } = useGetMenuStatsQuery();

    const {
        data: tableStats,
        isLoading: tableLoading,
        refetch: refetchTable
    } = useGetTableStatsQuery();

    const {
        data: orderStats,
        isLoading: orderLoading,
        refetch: refetchOrder
    } = useGetOrderStatsQuery(orderQueryParams);

    // Create refresh function for all business data
    const refreshBusinessData = React.useCallback(() => {
        refetchMenu();
        refetchTable();
        refetchOrder();
        if (refreshData) refreshData(); // Also call parent refresh if provided
    }, [refetchMenu, refetchTable, refetchOrder, refreshData]);

    const isLoading = menuLoading || tableLoading || orderLoading;

    // Business overview cards configuration
    const businessCards = [
        {
            title: 'Total Categories',
            value: menuStats?.data?.totalCategories || 0,
            subtitle: 'vs previous period',
            icon: <MdCategory className="w-6 h-6" />,
            color: 'bg-purple-500',
            trend: menuStats?.data?.trends?.categoriesGrowth || '+12%',
            trendUp: true
        },
        {
            title: 'Total Dishes',
            value: menuStats?.data?.totalDishes || 0,
            subtitle: 'vs previous period',
            icon: <MdRestaurant className="w-6 h-6" />,
            color: 'bg-green-600',
            trend: menuStats?.data?.trends?.dishesGrowth || '+12%',
            trendUp: true
        },
        {
            title: 'Active Orders',
            value: orderStats?.data?.activeOrders || 0,
            subtitle: 'vs previous period',
            icon: <MdShoppingCart className="w-6 h-6" />,
            color: 'bg-amber-600',
            trend: orderStats?.data?.trends?.ordersGrowth || '+12%',
            trendUp: true
        },
        {
            title: 'Total Tables',
            value: tableStats?.data?.totalTables || 0,
            subtitle: 'active tables',
            icon: <MdTableBar className="w-6 h-6" />,
            color: 'bg-purple-600',
            trend: `${tableStats?.data?.activeTables || 0}`,
            trendUp: true,
            isCount: true
        }
    ];

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">Business Overview</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">Key operational metrics and inventory information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="p-4 animate-pulse">
                            <div className="h-20 bg-gray-200 rounded"></div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Business Overview</h2>
                    <p className="text-sm text-gray-600">Key operational metrics and inventory information</p>
                </div>
                <Button
                    variant="ghost"
                    onClick={refreshBusinessData}
                    icon={<MdRefresh />}
                    size="sm"
                >
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {businessCards.map((card, index) => (
                    <Card key={index} className="p-4 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`${card.color} text-white p-2 rounded-lg`}>
                                        {card.icon}
                                    </div>
                                </div>

                                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mb-2">
                                    {card.value.toLocaleString()}
                                </p>

                                <div className="flex items-center gap-1">
                                    {card.trendUp ? (
                                        <MdTrendingUp className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <MdTrendingDown className="w-4 h-4 text-red-500" />
                                    )}
                                    <span className={`text-sm font-medium ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                        {card.trend}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-1">{card.subtitle}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Additional Business Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {/* Menu Availability */}
                <Card className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Menu Availability</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Available Dishes</span>
                            <span className="text-sm font-medium text-green-600">
                                {menuStats?.data?.availableDishes || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Dishes</span>
                            <span className="text-sm font-medium text-gray-900">
                                {menuStats?.data?.totalDishes || 0}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${menuStats?.data?.totalDishes > 0
                                        ? (menuStats.data.availableDishes / menuStats.data.totalDishes) * 100
                                        : 0}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </Card>

                {/* Table Status */}
                <Card className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Table Status</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Available</span>
                            <span className="text-sm font-medium text-green-600">
                                {tableStats?.data?.availableTables || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Booked</span>
                            <span className="text-sm font-medium text-amber-600">
                                {tableStats?.data?.bookedTables || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Occupancy Rate</span>
                            <span className="text-sm font-medium text-blue-600">
                                {tableStats?.data?.occupancyRate || '0%'}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Order Summary */}
                <Card className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Active Orders</span>
                            <span className="text-sm font-medium text-blue-600">
                                {orderStats?.data?.activeOrders || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Completed</span>
                            <span className="text-sm font-medium text-green-600">
                                {orderStats?.data?.completedOrders || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Orders</span>
                            <span className="text-sm font-medium text-gray-900">
                                {orderStats?.data?.totalOrders || 0}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default BusinessOverview;
