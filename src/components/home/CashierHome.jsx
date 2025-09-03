import React, { useState } from "react";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import { MdTrendingUp, MdRestaurant, MdTableBar, MdPayment, MdPerson } from "react-icons/md";
import { FaReceipt, FaClock } from "react-icons/fa";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, updateOrder } from "../../https/index";
import OrderDetailsModal from "../modals/OrderDetailsModal";
import toast, { Toaster } from "react-hot-toast";

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

const OrderCard = ({ order, index, onViewDetails, onProcessPayment }) => {
    // Get the correct total amount from bills
    const totalAmount = order.bills?.totalWithDiscount || order.bills?.total || 0;
    // Get table number
    const tableDisplay = order.table?.tableNo ? `Table ${order.table.tableNo}` : 'Table N/A';

    // Format time
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 overflow-hidden">
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600"></div>

            {/* Card content */}
            <div className="p-5">
                {/* Header with table info and status */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
                                #{index + 1}
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">
                                {tableDisplay}
                            </h3>
                            <p className="text-sm text-slate-600 flex items-center gap-1">
                                <MdPerson size={14} />
                                {order.customerDetails?.name || 'Guest'}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${order.orderStatus === 'Completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                            order.orderStatus === 'Ready' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                order.orderStatus === 'Preparing' || order.orderStatus === 'In Progress' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                    'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}>
                            {order.orderStatus || 'Pending'}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">{formatTime(order.createdAt)}</p>
                    </div>
                </div>

                {/* Order details */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 flex items-center gap-1">
                            <MdRestaurant size={14} />
                            Items:
                        </span>
                        <span className="text-sm font-semibold text-slate-900 bg-white px-2 py-1 rounded-md">
                            {order.items?.length || 0}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 flex items-center gap-1">
                            <BsCashCoin size={14} />
                            Total:
                        </span>
                        <span className="text-xl font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                            ৳{totalAmount.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 flex items-center gap-1">
                            <MdPayment size={14} />
                            Payment:
                        </span>
                        <span className={`text-sm font-semibold px-2 py-1 rounded-md ${order.isPaid
                            ? 'text-green-700 bg-green-100'
                            : 'text-red-700 bg-red-100'
                            }`}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                        onClick={() => onViewDetails(order)}
                    >
                        <FaReceipt size={14} className="mr-2" />
                        View Details
                    </Button>
                    {!order.isPaid && (
                        <Button
                            variant="primary"
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all"
                            onClick={() => onProcessPayment(order)}
                        >
                            <MdPayment size={16} className="mr-2" />
                            Process Payment
                        </Button>
                    )}
                </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
    );
};

const CashierHome = ({ userData }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    });

    // Mutation for updating order payment
    const updateOrderMutation = useMutation({
        mutationFn: updateOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            setIsModalOpen(false);
            setSelectedOrder(null);
            toast.success("Payment processed successfully!");
        },
        onError: (error) => {
            console.error("Failed to update order:", error);
            toast.error("Failed to process payment. Please try again.");
        }
    });

    // Handle view order details
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    // Handle process payment
    const handleProcessPayment = (order) => {
        if (order.orderStatus !== 'Completed') {
            toast.error("Payment can only be processed when order status is 'Completed'", {
                duration: 4000,
                position: 'top-center',
            });
            return;
        }

        updateOrderMutation.mutate({
            orderId: order._id,
            isPaid: true,
            paymentMethod: "Cash" // You can make this dynamic based on user selection
        });
    };

    const orders = ordersData?.data?.data || [];
    const pendingPaymentOrders = orders.filter(order => !order.isPaid).slice(0, 6);

    // Calculate cashier-specific stats
    const todayOrders = orders.filter(order => {
        const today = new Date().toDateString();
        return new Date(order.createdAt).toDateString() === today;
    });

    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.bills?.totalWithDiscount || order.bills?.total || 0), 0);
    const pendingPayments = orders.filter(order => !order.isPaid).length;
    const completedToday = todayOrders.filter(order => order.orderStatus === 'Completed').length;

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
            title: "Pending Payments",
            value: pendingPayments.toString(),
            change: -5.2,
            icon: MdPayment,
            color: "orange",
            isLoading: ordersLoading
        },
        {
            title: "Orders Completed",
            value: completedToday.toString(),
            change: 12.8,
            icon: FaReceipt,
            color: "blue",
            isLoading: ordersLoading
        },
        {
            title: "Active Orders",
            value: orders.filter(order =>
                order.orderStatus && !['Completed', 'Cancelled'].includes(order.orderStatus)
            ).length.toString(),
            change: 3.4,
            icon: GrInProgress,
            color: "purple",
            isLoading: ordersLoading
        },
    ];

    const quickActions = [
        {
            title: "View Orders",
            description: "Check all pending and active orders",
            icon: GrInProgress,
            onClick: () => navigate("/orders"),
            color: "blue"
        },
        {
            title: "Browse Menu",
            description: "View menu items and prices",
            icon: MdRestaurant,
            onClick: () => navigate("/menu"),
            color: "orange"
        },
        {
            title: "New Order",
            description: "Create order for walk-in customers",
            icon: MdTableBar,
            onClick: () => navigate("/tables"),
            color: "green"
        },
        {
            title: "Payment Processing",
            description: "Process pending payments",
            icon: MdPayment,
            onClick: () => navigate("/orders"),
            color: "purple"
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
            {/* Cashier Hero Section */}
            <Card variant="gradient" className="relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                                {getGreeting()}, {userData.name || "Cashier"}! 💰
                            </h1>
                            <p className="text-slate-600 mb-4">
                                Ready to serve customers! Manage orders and process payments efficiently.
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
                                    onClick={() => navigate("/menu")}
                                >
                                    Browse Menu
                                </Button>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="w-48 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl shadow-lg flex items-center justify-center">
                                <MdPayment size={48} className="text-white" />
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
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                        {quickActions.map((action, index) => (
                            <QuickActionCard key={index} {...action} />
                        ))}
                    </div>
                </div>

                {/* Pending Payments */}
                <div className="xl:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-slate-900">Pending Payments</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/orders")}
                        >
                            View All Orders
                        </Button>
                    </div>

                    {ordersLoading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <div className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-slate-200 rounded mb-2 w-2/3"></div>
                                                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-slate-200 rounded"></div>
                                            <div className="h-3 bg-slate-200 rounded"></div>
                                            <div className="h-8 bg-slate-200 rounded"></div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : pendingPaymentOrders.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {pendingPaymentOrders.map((order, index) => (
                                <OrderCard
                                    key={order._id}
                                    order={order}
                                    index={index}
                                    onViewDetails={handleViewDetails}
                                    onProcessPayment={handleProcessPayment}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <div className="text-center py-8">
                                <MdPayment size={48} className="text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">No pending payments found</p>
                                <p className="text-sm text-slate-400 mt-2">All orders have been paid for!</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            <OrderDetailsModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedOrder(null);
                }}
                order={selectedOrder}
                onProcessPayment={handleProcessPayment}
            />

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
};

export default CashierHome;
