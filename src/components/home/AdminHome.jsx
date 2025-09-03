import React, { useEffect } from "react";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import { MdTrendingUp, MdRestaurant, MdTableBar, MdDashboard, MdInventory } from "react-icons/md";
import { FaUsers, FaChartLine } from "react-icons/fa";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../https/index";

const StatCard = ({ title, value, change, icon: Icon, color = "orange", isLoading = false }) => {
    const colorClasses = {
        orange: "bg-orange-100 text-orange-600",
        green: "bg-green-100 text-green-600",
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
        red: "bg-red-100 text-red-600",
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
        red: "from-red-500 to-red-600",
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

const RecentOrderItem = ({ order, index }) => {
    // Get the correct total amount from bills
    const totalAmount = order.bills?.totalWithDiscount || order.bills?.total || 0;
    // Get table number
    const tableDisplay = order.table?.tableNo ? `Table ${order.table.tableNo}` : 'Table N/A';

    return (
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                #{index + 1}
            </div>
            <div className="flex-1">
                <p className="font-medium text-slate-900">
                    {tableDisplay}
                </p>
                <p className="text-sm text-slate-600">
                    {order.customerDetails?.name || 'Guest'} • {order.items?.length || 0} items
                </p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">৳{totalAmount}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.orderStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'Preparing' ? 'bg-orange-100 text-orange-700' :
                            order.orderStatus === 'Ready' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                        }`}>
                        {order.orderStatus || 'Pending'}
                    </span>
                </div>
                <p className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
};

const AdminHome = ({ userData }) => {
    const navigate = useNavigate();

    const { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    });

    const orders = ordersData?.data?.data || [];
    // Sort orders by createdAt in descending order (newest first)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentOrders = sortedOrders.slice(0, 8);

    // Calculate dynamic stats
    const todayOrders = orders.filter(order => {
        const today = new Date().toDateString();
        return new Date(order.createdAt).toDateString() === today;
    });

    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.bills?.totalWithDiscount || order.bills?.total || 0), 0);
    const activeOrders = orders.filter(order =>
        order.orderStatus && !['Completed', 'Cancelled'].includes(order.orderStatus)
    ).length;

    const stats = [
        {
            title: "Today's Revenue",
            value: `৳${todayRevenue.toLocaleString()}`,
            change: 8.2,
            icon: BsCashCoin,
            color: "green",
            isLoading: ordersLoading
        },
        {
            title: "Active Orders",
            value: activeOrders.toString(),
            change: 12.5,
            icon: GrInProgress,
            color: "orange",
            isLoading: ordersLoading
        },
        {
            title: "Today's Orders",
            value: todayOrders.length.toString(),
            change: 5.3,
            icon: MdRestaurant,
            color: "blue",
            isLoading: ordersLoading
        },
        {
            title: "Total Orders",
            value: orders.length.toString(),
            change: 2.1,
            icon: MdTableBar,
            color: "purple",
            isLoading: ordersLoading
        },
    ];

    const quickActions = [
        {
            title: "Dashboard",
            description: "View detailed analytics and reports",
            icon: MdDashboard,
            onClick: () => navigate("/dashboard"),
            color: "purple"
        },
        {
            title: "Manage Orders",
            description: "View and manage all restaurant orders",
            icon: GrInProgress,
            onClick: () => navigate("/orders"),
            color: "blue"
        },
        {
            title: "Menu Management",
            description: "Add, edit, and organize menu items",
            icon: MdRestaurant,
            onClick: () => navigate("/menu"),
            color: "orange"
        },
        {
            title: "Table Management",
            description: "Monitor table status and reservations",
            icon: MdTableBar,
            onClick: () => navigate("/tables"),
            color: "green"
        },
        {
            title: "Staff Management",
            description: "Manage employee accounts and roles",
            icon: FaUsers,
            onClick: () => navigate("/dashboard"),
            color: "red"
        },
        {
            title: "Analytics",
            description: "View sales reports and insights",
            icon: FaChartLine,
            onClick: () => navigate("/dashboard"),
            color: "blue"
        },
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="space-y-8">
            {/* Admin Hero Section */}
            <Card variant="gradient" className="relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                                {getGreeting()}, {userData.name || "Admin"}! 👑
                            </h1>
                            <p className="text-slate-600 mb-4">
                                Welcome to your admin dashboard. Monitor your restaurant's performance and manage operations.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant="primary"
                                    onClick={() => navigate("/dashboard")}
                                    className="shadow-lg"
                                >
                                    View Dashboard
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate("/orders")}
                                >
                                    Manage Orders
                                </Button>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="w-48 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-lg flex items-center justify-center">
                                <MdDashboard size={48} className="text-white" />
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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="xl:col-span-1">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Admin Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                        {quickActions.map((action, index) => (
                            <QuickActionCard key={index} {...action} />
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="xl:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-slate-900">Recent Orders</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/orders")}
                        >
                            View All Orders
                        </Button>
                    </div>
                    <Card>
                        {ordersLoading ? (
                            <div className="space-y-3">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                        <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-slate-200 rounded mb-2 w-1/3"></div>
                                            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-5 bg-slate-200 rounded"></div>
                                                <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
                                            </div>
                                            <div className="w-12 h-3 bg-slate-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentOrders.length > 0 ? (
                            <div className="space-y-3">
                                {recentOrders.map((order, index) => (
                                    <RecentOrderItem key={order._id} order={order} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <MdRestaurant size={48} className="text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">No recent orders found</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
