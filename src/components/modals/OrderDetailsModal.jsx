import React, { useState } from "react";
import { MdClose, MdTableRestaurant, MdPerson, MdAccessTime, MdReceipt } from "react-icons/md";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import Button from "../ui/Button";
import Card from "../ui/Card";

const OrderDetailsModal = ({ isOpen, onClose, order, onProcessPayment }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !order) return null;

    // Get the correct total amount from bills
    const totalAmount = order.bills?.totalWithDiscount || order.bills?.total || 0;
    const discountAmount = order.bills?.discountAmount || 0;
    const originalTotal = order.bills?.total || 0;

    // Get table display
    const tableDisplay = order.table?.tableNo ? `Table ${order.table.tableNo}` : 'Table N/A';

    // Check if payment button should be disabled
    const isPaymentDisabled = order.orderStatus === 'In Progress' || order.orderStatus === 'Preparing' || order.orderStatus === 'Ready';

    // Check if payment button should be shown
    const showPaymentButton = !order.isPaid;

    const handleProcessPayment = async () => {
        if (order.orderStatus !== 'Completed') return;

        setIsProcessing(true);
        try {
            await onProcessPayment(order);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString()
        };
    };

    const { date, time } = formatDateTime(order.createdAt);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <div className="flex items-center gap-3">
                        <MdReceipt size={24} />
                        <div>
                            <h2 className="text-xl font-semibold">Order Details</h2>
                            <p className="text-orange-100 text-sm">Order ID: #{order._id?.slice(-8) || 'N/A'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-orange-600 rounded-full transition-colors"
                    >
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[calc(85vh-160px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Order Info */}
                        <Card className="p-3">
                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <MdTableRestaurant className="text-orange-500" />
                                Order Information
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Table:</span>
                                    <span className="font-medium">{tableDisplay}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.orderStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                                        order.orderStatus === 'Ready' ? 'bg-blue-100 text-blue-700' :
                                            order.orderStatus === 'Preparing' || order.orderStatus === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {order.orderStatus || 'Pending'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="font-medium">{date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time:</span>
                                    <span className="font-medium">{time}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Customer Info */}
                        <Card className="p-3">
                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <MdPerson className="text-orange-500" />
                                Customer Information
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Name:</span>
                                    <span className="font-medium">{order.customerDetails?.name || 'Guest'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phone:</span>
                                    <span className="font-medium">{order.customerDetails?.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Guests:</span>
                                    <span className="font-medium">{order.customerDetails?.guests || 1}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Order Items */}
                    <Card className="p-3 mb-3">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <MdReceipt className="text-orange-500" />
                            Order Items ({order.items?.length || 0})
                        </h3>
                        <div className="space-y-2">
                            {order.items?.length > 0 ? (
                                order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{item.name || 'Item Name'}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">৳{(item.price * item.quantity) || 0}</p>
                                            <p className="text-sm text-gray-600">৳{item.price || 0} each</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No items found</p>
                            )}
                        </div>
                    </Card>

                    {/* Payment Summary */}
                    <Card className="p-3">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <FaMoneyBillWave className="text-orange-500" />
                            Payment Summary
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">৳{originalTotal}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="font-medium text-green-600">-৳{discountAmount}</span>
                                </div>
                            )}
                            <div className="border-t pt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                                    <span className="text-2xl font-bold text-orange-600">৳{totalAmount}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-gray-600">Payment Status:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {order.isPaid ? 'Paid' : 'Pending'}
                                </span>
                            </div>
                            {order.paymentMethod && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-medium">{order.paymentMethod}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    {showPaymentButton && (
                        <Button
                            variant="primary"
                            onClick={handleProcessPayment}
                            disabled={isPaymentDisabled || isProcessing}
                            className={`flex items-center gap-2 ${isPaymentDisabled ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            <FaCreditCard size={16} />
                            {isProcessing ? 'Processing...' : 'Process Payment'}
                        </Button>
                    )}
                </div>


            </div>
        </div>
    );
};

export default OrderDetailsModal;
