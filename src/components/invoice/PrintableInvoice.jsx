import React, { useEffect } from 'react';
import logo from '../../assets/images/logo.jpg';

const PrintableInvoice = ({ orderInfo }) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${orderInfo?.customerDetails?.name || 'Invoice'}`;
    return () => {
      document.title = originalTitle;
    };
  }, [orderInfo]);

  return (
    <div className="printable-invoice bg-white text-gray-800 font-sans p-6">
      {/* Restaurant Header */}
      <div className="text-center border-b-2 border-gray-300 pb-4">
        <img src={logo} alt="Restaurant Logo" className="mx-auto max-w-20 mb-2" style={{maxWidth: '48px', height: 'auto'}} />
        <h1 className="text-3xl font-bold">Kacchi Express</h1>
        <p className="text-md font-semibold text-gray-600">The Taste of Traditional Kacchi</p>
        <p className="text-sm text-gray-500 mt-2">
          Nowapara, Abhaynagar, Jessore<br />
          Phone: +880 1922315967 | Email: kacchi.express@gmail.com
        </p>
      </div>

      {/* Invoice Title */}
      <div className="text-center my-6">
        <h2 className="text-2xl font-bold tracking-wider">ORDER RECEIPT</h2>
        <p className="text-gray-600">Thank you for your order!</p>
      </div>

      {/* Order Information */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <div>
          <p><strong>Order ID:</strong> {Math.floor(new Date(orderInfo.orderDate).getTime())}</p>
          <p><strong>Date:</strong> {new Date(orderInfo.orderDate).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p><strong>Time:</strong> {new Date(orderInfo.orderDate).toLocaleTimeString()}</p>
          <p><strong>Table:</strong> {orderInfo.table?.tableNo || 'N/A'}</p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="border-t border-gray-300 pt-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
        <div className="text-sm">
          <p><strong>Name:</strong> {orderInfo.customerDetails.name}</p>
          <p><strong>Phone:</strong> {orderInfo.customerDetails.phone}</p>
          <p><strong>Guests:</strong> {orderInfo.customerDetails.guests}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="border-t border-gray-300 pt-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Items Ordered</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left pb-2">Item</th>
              <th className="text-center pb-2">Qty</th>
              <th className="text-right pb-2">Price</th>
              <th className="text-right pb-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderInfo.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2">{item.name}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">৳{(item.price / item.quantity).toFixed(2)}</td>
                <td className="text-right">৳{item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bill Summary */}
      <div className="border-t border-gray-300 pt-4 text-sm">
        <div className="flex justify-between mb-1">
          <span>Subtotal:</span>
          <span>৳{orderInfo.bills.total.toFixed(2)}</span>
        </div>
        {orderInfo.bills.couponCode && (
          <div className="flex justify-between mb-1 text-red-600">
            <span>Discount ({orderInfo.bills.couponCode}):</span>
            <span>-৳{orderInfo.bills.discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg border-t-2 border-gray-300 pt-2 mt-2">
          <span>TOTAL:</span>
          <span>৳{orderInfo.bills.totalWithDiscount.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Information */}
      {orderInfo.isPaid && (
        <div className="border-t border-gray-300 pt-4 mt-6">
          <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
          <div className="text-sm">
            <p><strong>Payment Method:</strong> {orderInfo.paymentMethod}</p>
            <p><strong>Status:</strong> <span className="font-bold text-green-600">PAID</span></p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center border-t-2 border-gray-300 pt-6 mt-6 text-xs text-gray-500">
        <p>Thank you for dining with us!</p>
        <p>Please visit us again soon.</p>
        <p className="font-bold mt-2">Powered by: {orderInfo?.restaurant?.name || 'Bytespate Limited'}</p>
      </div>
    </div>
  );
};


export default PrintableInvoice;