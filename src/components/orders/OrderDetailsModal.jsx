import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { addNotification } from "../../redux/slices/notificationSlice";
import { processCashPayment, updateOrderStatus, cancelOrder } from "../../https"; // Import cancelOrder

import Invoice from "../invoice/Invoice"; // Reusing the Invoice component

const OrderDetailsModal = ({ orderInfo, onClose }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(orderInfo); // Local state for order, to update isPaid

  // Derived states for button enablement
  const isOrderCompleted = currentOrder && currentOrder.orderStatus === "Completed";
  const isOrderCancelled = currentOrder && currentOrder.orderStatus === "Cancelled";
  const canProcessPayment = isOrderCompleted && !currentOrder.isPaid;
  const canPrintReceipt = isOrderCompleted && currentOrder.isPaid;
  const canCancelOrder = currentOrder && currentOrder.orderStatus === "In Progress" && !currentOrder.isPaid; // Order can be cancelled when in progress and unpaid

  const handleProcessPayment = async () => {
    setIsPaymentProcessing(true);
    try {
      const { data } = await processCashPayment({
        amount: currentOrder.bills.totalWithDiscount.toFixed(2),
        orderId: currentOrder._id,
      });
      enqueueSnackbar(data.message, { variant: "success" });
      dispatch(addNotification({
        message: `Payment processed for Order #${currentOrder._id.substring(0, 8)}!`, type: "success"
      }));
      
      // Update local order state and invalidate queries to refetch orders list
      setCurrentOrder((prev) => ({ ...prev, isPaid: true, paymentMethod: "Cash" }));
      queryClient.invalidateQueries(["orders"]); // Invalidate orders query to reflect updated paid status
      
      setShowInvoice(true); // Show invoice after successful payment

    } catch (error) {
      console.error("Error processing payment:", error.response);
      enqueueSnackbar(error.response?.data?.message || "Payment failed!", { variant: "error" });
      dispatch(addNotification({
        message: `Payment failed for Order #${currentOrder._id.substring(0, 8)}: ${error.response?.data?.message || "Unknown error"}`, type: "error"
      }));
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handleCancelOrder = async () => {
    setIsPaymentProcessing(true);
    try {
      const { data } = await cancelOrder(currentOrder._id);
      enqueueSnackbar(data.message, { variant: "success" });
      dispatch(addNotification({
        message: `Order #${currentOrder._id.substring(0, 8)} cancelled!`, type: "success"
      }));
      
      // Update local order state and invalidate queries to refetch orders list
      setCurrentOrder((prev) => ({ ...prev, orderStatus: "Cancelled" }));
      queryClient.invalidateQueries(["orders"]); // Invalidate orders query to reflect updated status
      
      onClose(); // Close the modal after successful cancellation

    } catch (error) {
      console.error("Error cancelling order:", error.response);
      enqueueSnackbar(error.response?.data?.message || "Order cancellation failed!", { variant: "error" });
      dispatch(addNotification({
        message: `Order #${currentOrder._id.substring(0, 8)} cancellation failed: ${error.response?.data?.message || "Unknown error"}`, type: "error"
      }));
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  return (
    <div className="p-4 text-gray-800 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Order #{currentOrder._id.substring(0, 8)} Details</h3>

      {/* Customer Details */}
      <div className="mb-4">
        <h4 className="font-semibold text-md mb-2">Customer Information:</h4>
        <p><strong>Name:</strong> {currentOrder.customerDetails.name}</p>
        <p><strong>Phone:</strong> {currentOrder.customerDetails.phone}</p>
        <p><strong>Guests:</strong> {currentOrder.customerDetails.guests}</p>
        <p><strong>Table:</strong> {currentOrder.table.tableNo}</p>
      </div>

      {/* Order Summary */}
      <div className="mb-4 border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-md mb-2">Order Summary:</h4>
        <ul className="list-disc list-inside text-gray-700">
          {currentOrder.items.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} - ৳{item.pricePerQuantity} each = ৳{item.price}
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-2 text-gray-700">
            <p><strong>Subtotal:</strong></p>
            <p>৳{currentOrder.bills.total.toFixed(2)}</p>
        </div>
        {currentOrder.bills.couponCode && (
            <div className="flex justify-between text-gray-700">
                <p><strong>Discount ({currentOrder.bills.couponCode}):</strong></p>
                <p>- ৳{currentOrder.bills.discountAmount.toFixed(2)}</p>
            </div>
        )}
        <div className="flex justify-between font-bold text-lg mt-2 text-gray-900">
            <p>Grand Total:</p>
            <p>৳{currentOrder.bills.totalWithDiscount.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Payment Status */}
      <div className="mb-4 border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-md mb-2">Payment Status:</h4>
        <p className="text-gray-700"><strong>Status:</strong> {currentOrder.isPaid ? "Paid" : "Unpaid"}</p>
        {currentOrder.isPaid && <p className="text-gray-700"><strong>Method:</strong> {currentOrder.paymentMethod}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-4">
        {!canPrintReceipt && !isOrderCancelled && (
            <button
            onClick={handleProcessPayment}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 w-full rounded-lg text-white font-semibold text-lg transition-colors duration-200"
            disabled={!canProcessPayment || isPaymentProcessing}
            >
            {isPaymentProcessing ? "Processing..." : "Process Payment"}
            </button>
        )}
        {canPrintReceipt && (
            <button
            onClick={() => setShowInvoice(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 w-full rounded-lg text-white font-semibold text-lg transition-colors duration-200"
            >
            Print Invoice
            </button>
        )}
        {canCancelOrder && (
          <button
            onClick={handleCancelOrder}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 w-full rounded-lg text-white font-semibold text-lg transition-colors duration-200"
          >
            Cancel Order
          </button>
        )}
      </div>

      {showInvoice && (
        <Invoice orderInfo={currentOrder} setShowInvoice={setShowInvoice} />
      )}
    </div>
  );
};

export default OrderDetailsModal;