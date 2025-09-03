import React from "react";
import { GrInProgress } from "react-icons/gr";
import { MdTrendingUp, MdRestaurant, MdTableBar, MdCheckCircle } from "react-icons/md";
import { FaClock, FaUtensils } from "react-icons/fa";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders, updateOrderStatus, deleteOrder } from "../../https/index";
import { enqueueSnackbar } from "notistack";

const StatCard = ({ title, value, change, icon: Icon, color = "orange", isLoading = false }) => {
    const colorClasses = {
        orange: "bg-orange-100 text-orange-600",
        green: "bg-green-100 text-green-600",
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
    };

    if (isLoading) {
        return (
            <Card variant="default" className="animate-pulse">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded mb-2 w-2/3"></div>
                        <div className="h-8 bg-slate-200 rounded mb-2 w-1/2"></div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                    </div>
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                </div>
            </Card>
        );
    }

    return (
        <Card variant="default" hover className="relative overflow-hidden">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
                    <div className="flex items-center gap-1">
                        <MdTrendingUp className="text-green-500 text-sm" />
                        <span className="text-sm text-green-600 font-medium">+{change}%</span>
                        <span className="text-sm text-slate-500">vs yesterday</span>
                    </div>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-slate-50 rounded-full transform translate-x-16 -translate-y-16 opacity-50"></div>
        </Card>
    );
};

const QuickActionCard = ({ title, description, icon: Icon, onClick, color = "orange" }) => {
    const colorClasses = {
        orange: "from-orange-500 to-orange-600",
        green: "from-green-500 to-green-600",
        blue: "from-blue-500 to-blue-600",
        purple: "from-purple-500 to-purple-600",
    };

    return (
        <Card
            variant="default"
            hover
            className="cursor-pointer group"
            onClick={onClick}
        >
            <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                    <p className="text-sm text-slate-600">{description}</p>
                </div>
            </div>
        </Card>
    );
};

const OrderStatusCard = ({ order, index, onStatusUpdate, onDeleteOrder }) => {
    const getDisplayStatus = (status) => {
        if (status === 'In Progress') return 'Preparing';
        return status;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Preparing':
            case 'In Progress': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Ready': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getNextStatus = (currentStatus) => {
        const statusFlow = {
            'Pending': 'Preparing',
            'Preparing': 'Ready',
            'In Progress': 'Ready',
            'Ready': 'Completed'
        };
        return statusFlow[currentStatus];
    };

    const nextStatus = getNextStatus(order.orderStatus);

    return (
        <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                        #{index + 1}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">
                            {order.table?.tableNo ? `Table ${order.table.tableNo}` : 'Table N/A'}
                        </p>
                        <p className="text-sm text-slate-600">
                            {order.customerDetails?.name || 'Guest'} • {order.items?.length || 0} items
                        </p>
                        <p className="text-xs text-slate-500">
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                    {getDisplayStatus(order.orderStatus) || 'Pending'}
                </span>
            </div>

            {order.items && order.items.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Order Items:</h4>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-slate-600">{item.title} x{item.quantity}</span>
                                <span className="text-slate-900 font-medium">৳{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>৳{order.bills?.totalWithDiscount || order.bills?.total || 0}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2">
                {nextStatus && order.orderStatus !== 'Completed' && (
                    <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => onStatusUpdate(order._id, nextStatus)}
                    >
                        Mark as {nextStatus}
                    </Button>
                )}
                <Button
                    variant="destructive"
                    size="sm"
                    className="w-full bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                    onClick={() => onDeleteOrder(order._id)}
                    disabled={order.orderStatus !== 'In Progress'}
                >
                    Cancel Order
                </Button>
            </div>
        </Card>
    );
};

const StaffHome = ({ userData }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    });

    const orders = ordersData?.data?.data || [];

    // Filter orders that staff should focus on
    const activeOrders = orders.filter(order =>
        order.orderStatus && !['Completed', 'Cancelled'].includes(order.orderStatus)
    ).slice(0, 8);

    // Calculate staff-specific stats
    const todayOrders = orders.filter(order => {
        const today = new Date().toDateString();
        return new Date(order.createdAt).toDateString() === today;
    });

    // Get all In Progress orders
    const inProgressOrders = orders.filter(order => order.orderStatus === 'In Progress');
    
    // Only the first In Progress order goes to Currently Preparing
    const preparingOrders = inProgressOrders.length > 0 ? 1 : 0;
    

    const readyOrders = orders.filter(order => order.orderStatus === 'Ready').length;
    const completedToday = todayOrders.filter(order => order.orderStatus === 'Completed').length;

    const stats = [
        {
            title: "New Orders",
            value: (orders.filter(order => !order.orderStatus || order.orderStatus === 'Pending').length + 
                   (inProgressOrders.length > 1 ? inProgressOrders.length - 1 : 0)).toString(),
            change: 5.2,
            icon: FaClock,
            color: "orange",
            isLoading: ordersLoading
        },
        {
            title: "Currently Preparing",
            value: preparingOrders.toString(),
            change: 8.1,
            icon: FaUtensils,
            color: "blue",
            isLoading: ordersLoading
        },
        {
            title: "Ready to Serve",
            value: readyOrders.toString(),
            change: -2.3,
            icon: MdCheckCircle,
            color: "green",
            isLoading: ordersLoading
        },
        {
            title: "Completed Today",
            value: completedToday.toString(),
            change: 12.8,
            icon: MdRestaurant,
            color: "purple",
            isLoading: ordersLoading
        },
    ];

    const quickActions = [
        {
            title: "View All Orders",
            description: "See complete order list and status",
            icon: GrInProgress,
            onClick: () => navigate("/orders"),
            color: "blue"
        },
        {
            title: "Table Status",
            description: "Check which tables need attention",
            icon: MdTableBar,
            onClick: () => navigate("/tables"),
            color: "green"
        },
    ];

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus({ orderId, orderStatus: newStatus });
            // Trigger a refetch of orders data
            queryClient.invalidateQueries(['orders']);
            enqueueSnackbar(`Order status updated to ${newStatus}`, { variant: 'success' });
        } catch (error) {
            console.error('Failed to update order status:', error);
            enqueueSnackbar('Failed to update order status', { variant: 'error' });
        }
    };
    
    const handleDeleteOrder = async (orderId) => {
        try {
            if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
                await deleteOrder(orderId);
                // Trigger a refetch of orders data
                queryClient.invalidateQueries(['orders']);
                enqueueSnackbar('Order deleted successfully', { variant: 'success' });
            }
        } catch (error) {
            console.error('Failed to delete order:', error);
            enqueueSnackbar('Failed to delete order', { variant: 'error' });
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="space-y-8">
            {/* Staff Hero Section */}
            <Card variant="gradient" className="relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                                {getGreeting()}, {userData.name || "Staff"}! 👨‍🍳
                            </h1>
                            <p className="text-slate-600 mb-4">
                                Ready to serve delicious food! Focus on order preparation and customer satisfaction.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant="primary"
                                    onClick={() => navigate("/orders")}
                                    className="shadow-lg"
                                >
                                    View Orders
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate("/tables")}
                                >
                                    Check Tables
                                </Button>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="w-48 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl shadow-lg flex items-center justify-center">
                                <FaUtensils size={48} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Quick Actions */}
                <div className="xl:col-span-1">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
                    <div className="space-y-4">
                        {quickActions.map((action, index) => (
                            <QuickActionCard key={index} {...action} />
                        ))}
                    </div>
                </div>

                {/* Active Orders */}
                <div className="xl:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-slate-900">Active Orders</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/orders")}
                        >
                            View All Orders
                        </Button>
                    </div>

                    {ordersLoading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i} className="animate-pulse p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-slate-200 rounded mb-2 w-2/3"></div>
                                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="h-3 bg-slate-200 rounded"></div>
                                        <div className="h-3 bg-slate-200 rounded"></div>
                                    </div>
                                    <div className="h-8 bg-slate-200 rounded"></div>
                                </Card>
                            ))}
                        </div>
                    ) : activeOrders.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {activeOrders.map((order, index) => (
                                <OrderStatusCard
                                    key={order._id}
                                    order={order}
                                    index={index}
                                    onStatusUpdate={handleStatusUpdate}
                                    onDeleteOrder={handleDeleteOrder}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <div className="text-center py-8">
                                <MdCheckCircle size={48} className="text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">No active orders</p>
                                <p className="text-sm text-slate-400 mt-2">All caught up! Great work!</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffHome;
