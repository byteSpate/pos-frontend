import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import {
  addOrder,
  processCashPayment,
  updateTable,
  applyCoupon,
} from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import Invoice from "../invoice/Invoice";
import { addNotification } from "../../redux/slices/notificationSlice";

const Bill = () => {
  const dispatch = useDispatch();

  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const total = useSelector(getTotalPrice);

  const [paymentMethod, setPaymentMethod] = useState("Cash"); // Default to Cash, though not used immediately
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null); // Initialize with null

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalWithDiscount, setTotalWithDiscount] = useState(total);

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Update totalWithDiscount when total or discountAmount changes
  React.useEffect(() => {
    setTotalWithDiscount(total - discountAmount);
  }, [total, discountAmount]);

  const handleApplyCoupon = async () => {
    try {
      const { data } = await applyCoupon({
        code: couponCodeInput,
        totalAmount: total,
      });
      enqueueSnackbar(data.message, { variant: "success" });
      setAppliedCoupon(data.couponCode);
      setDiscountAmount(data.discountAmount);
      setTotalWithDiscount(data.totalWithDiscount);
      } catch (error) {
      console.error("Error applying coupon:", error);
      enqueueSnackbar(error.response?.data?.message || "Failed to apply coupon!", { variant: "error" });
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setTotalWithDiscount(total);
    }
  };

  const tableUpdateMutation = useMutation({
    mutationFn: updateTable,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      console.log(data);

      setOrderInfo(data);

      // Update Table
      const tableData = {
        status: "Booked",
        orderId: data._id,
        tableId: data.table,
      };

      setTimeout(() => {
        tableUpdateMutation.mutate(tableData);
      }, 1500);

      enqueueSnackbar("Order Placed! Awaiting Payment!", {
        variant: "success",
      });
      dispatch(addNotification({
        message: `Order #${data._id.substring(0, 8)} placed and awaiting payment!`, type: "info"
      }));

      // Moved setShowInvoice, removeAllItems, and removeCustomer to handleProcessPayment's onSuccess
      // setTimeout(() => {
      //   setShowInvoice(true);
      //   dispatch(removeAllItems());
      //   dispatch(removeCustomer());
      // }, 1500);
    },
    onError: (error) => {
      console.error("Error placing order:", error.response);
      enqueueSnackbar(error.response?.data?.message || "Failed to place order!", { variant: "error" });
      dispatch(addNotification({
        message: `Failed to place order: ${error.response?.data?.message || "Unknown error"}`, type: "error"
      }));
    },
  });

  const handlePlaceOrder = async () => {
    if (cartData.length === 0) {
      enqueueSnackbar("Cart is empty! Please add items.", { variant: "warning" });
      return;
    }
    if (!customerData.customerName) {
      enqueueSnackbar("Please enter customer details!", { variant: "warning" });
      return;
    }

    // Place the order
    const orderData = {
      customerDetails: {
        name: customerData.customerName,
        phone: customerData.customerPhone,
        guests: customerData.guests,
      },
      orderStatus: "In Progress",
      bills: {
        total: total,
        couponCode: appliedCoupon,
        discountAmount: discountAmount,
        totalWithDiscount: totalWithDiscount,
      },
      items: cartData,
      table: customerData.table.tableId,
      // paymentMethod is not set here, isPaid is false by default
    };
    orderMutation.mutate(orderData);
  };

  const handleProcessPayment = async () => {
    setIsPaymentProcessing(true);
    try {
      const { data } = await processCashPayment({
        amount: totalWithDiscount.toFixed(2),
        orderId: orderInfo._id,
      });
      enqueueSnackbar(data.message, { variant: "success" });
      dispatch(addNotification({
        message: `Payment processed for Order #${orderInfo._id.substring(0, 8)}!`, type: "success"
      }));
      setOrderInfo((prev) => ({ ...prev, isPaid: true, paymentMethod: "Cash" }));
      setShowInvoice(true); // Show invoice after successful payment
      dispatch(removeAllItems());
      dispatch(removeCustomer());
    } catch (error) {
      console.error("Error processing payment:", error.response);
      enqueueSnackbar(error.response?.data?.message || "Payment failed!", { variant: "error" });
      dispatch(addNotification({
        message: `Payment failed for Order #${orderInfo._id.substring(0, 8)}: ${error.response?.data?.message || "Unknown error"}`, type: "error"
      }));
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const isOrderCompleted = orderInfo && orderInfo.orderStatus === "Completed";
  const canProcessPayment = isOrderCompleted && !orderInfo.isPaid;
  const canPrintReceipt = isOrderCompleted && orderInfo.isPaid;

  return (
    <div className="bg-white p-3 lg:p-4">
      <div className="flex items-center justify-between px-1 lg:px-2 mb-2">
        <p className="text-xs text-gray-600 font-medium">
          Items({cartData.length})
        </p>
        <h1 className="text-gray-800 text-sm lg:text-base font-bold">
          ৳{total.toFixed(2)}
        </h1>
      </div>

      <div className="hidden lg:block">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 sm:justify-between px-1 lg:px-2 mb-2">
          <input
            type="text"
            placeholder="Enter Coupon Code"
            className="bg-gray-50 text-gray-800 px-3 py-2 rounded-lg w-full sm:mr-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            value={couponCodeInput}
            onChange={(e) => setCouponCodeInput(e.target.value)}
            disabled={orderInfo !== null}
          />
          <button
            onClick={handleApplyCoupon}
            className="bg-blue-600 px-3 py-2 rounded-lg text-white font-semibold w-full sm:w-auto hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={orderInfo !== null}
          >
            Apply
          </button>
        </div>
      </div>

      {appliedCoupon && (
        <div className="flex items-center justify-between px-1 lg:px-2 mb-2">
          <p className="text-xs text-gray-600 font-medium">Discount ({appliedCoupon})</p>
          <h1 className="text-gray-800 text-sm lg:text-base font-bold">- ৳{discountAmount.toFixed(2)}</h1>
        </div>
      )}

      <div className="flex items-center justify-between px-1 lg:px-2 mb-3">
        <p className="text-sm lg:text-base text-gray-800 font-semibold">
          Total
        </p>
        <h1 className="text-gray-900 text-lg lg:text-xl font-bold">
          ৳{totalWithDiscount.toFixed(2)}
        </h1>
      </div>

      <div className="px-1 lg:px-2">
        <button
          onClick={handlePlaceOrder}
          className="bg-orange-600 px-4 py-3 w-full rounded-lg text-white font-semibold text-base lg:text-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          disabled={orderInfo !== null}
        >
          Place Order
        </button>
      </div>

      {isOrderCompleted && (
        <div className="flex flex-col gap-2 px-1 lg:px-2 mt-3">
          <button
            onClick={() => setShowInvoice(true)}
            className="bg-blue-600 px-4 py-2 w-full rounded-lg text-white font-semibold text-sm lg:text-base hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canPrintReceipt}
          >
            Print Receipt
          </button>
          <button
            onClick={handleProcessPayment}
            className="bg-orange-600 px-4 py-2 w-full rounded-lg text-white font-semibold text-sm lg:text-base hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canProcessPayment || isPaymentProcessing}
          >
            {isPaymentProcessing ? "Processing..." : "Process Payment"}
          </button>
        </div>
      )}

      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}
    </div>
  );
};

export default Bill;
