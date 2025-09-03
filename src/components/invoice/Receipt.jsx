import React from 'react';
import { MdCheckCircle } from 'react-icons/md';

const Receipt = ({ orderInfo, compact = false }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `৳${amount.toFixed(2)}`;
  };

  if (compact) {
    // Compact receipt for small prints (thermal printer style)
    return (
      <div className="receipt-compact" style={{ width: '300px', fontFamily: 'monospace' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>RESTRO</h1>
          <p style={{ fontSize: '12px', margin: '5px 0' }}>Restaurant POS System</p>
          <p style={{ fontSize: '10px', margin: '0' }}>123 Main Street, City</p>
          <p style={{ fontSize: '10px', margin: '0' }}>Phone: (555) 123-4567</p>
        </div>

        <div style={{ borderTop: '1px dashed #000', paddingTop: '10px', marginBottom: '10px' }}>
          <p style={{ fontSize: '12px', margin: '2px 0' }}>
            <strong>Order ID:</strong> {Math.floor(new Date(orderInfo.orderDate).getTime())}
          </p>
          <p style={{ fontSize: '12px', margin: '2px 0' }}>
            <strong>Date:</strong> {formatDate(orderInfo.orderDate)}
          </p>
          <p style={{ fontSize: '12px', margin: '2px 0' }}>
            <strong>Table:</strong> {orderInfo.table?.tableNo || 'N/A'}
          </p>
          <p style={{ fontSize: '12px', margin: '2px 0' }}>
            <strong>Customer:</strong> {orderInfo.customerDetails.name}
          </p>
        </div>

        <div style={{ borderTop: '1px dashed #000', paddingTop: '10px', marginBottom: '10px' }}>
          {orderInfo.items.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', margin: '3px 0' }}>
              <span>{item.name} x{item.quantity}</span>
              <span>{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px dashed #000', paddingTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', margin: '3px 0' }}>
            <span>Subtotal:</span>
            <span>{formatCurrency(orderInfo.bills.total)}</span>
          </div>
          {orderInfo.bills.couponCode && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', margin: '3px 0', color: '#dc2626' }}>
              <span>Discount ({orderInfo.bills.couponCode}):</span>
              <span>-{formatCurrency(orderInfo.bills.discountAmount)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', margin: '8px 0', borderTop: '1px solid #000', paddingTop: '5px' }}>
            <span>TOTAL:</span>
            <span>{formatCurrency(orderInfo.bills.totalWithDiscount)}</span>
          </div>
        </div>

        {orderInfo.isPaid && (
          <div style={{ borderTop: '1px dashed #000', paddingTop: '10px', marginBottom: '10px' }}>
            <p style={{ fontSize: '12px', margin: '2px 0' }}>
              <strong>Payment:</strong> {orderInfo.paymentMethod}
            </p>
            <p style={{ fontSize: '12px', margin: '2px 0', color: '#22c55e' }}>
              <strong>Status:</strong> PAID ✓
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px dashed #000', paddingTop: '10px' }}>
          <p style={{ fontSize: '11px', margin: '3px 0' }}>Thank you for dining with us!</p>
          <p style={{ fontSize: '10px', margin: '3px 0' }}>Please visit us again soon.</p>
        </div>
      </div>
    );
  }

  // Full-size receipt
  return (
    <div className="receipt-full bg-white text-black p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-black pb-6">
        <h1 className="text-3xl font-bold mb-2">KACCHI EXPRESS</h1>
        <p className="text-lg font-semibold mb-3">The Taste of Traditional Kacchi</p>
        <p className="text-sm">123 Main Street, City, State 12345</p>
        <p className="text-sm">Phone: (555) 123-4567 | Email: info@kacchiexpress.com</p>
      </div>

      {/* Success Icon and Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <MdCheckCircle className="text-green-600 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold mb-2">ORDER RECEIPT</h2>
        <p className="text-gray-600">Thank you for your order!</p>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-3 border-b border-gray-300 pb-2">Order Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">Order ID:</span>
              <span>{Math.floor(new Date(orderInfo.orderDate).getTime())}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Date:</span>
              <span>{formatDate(orderInfo.orderDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Table:</span>
              <span>{orderInfo.table?.tableNo || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-3 border-b border-gray-300 pb-2">Customer Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">Name:</span>
              <span>{orderInfo.customerDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Phone:</span>
              <span>{orderInfo.customerDetails.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Guests:</span>
              <span>{orderInfo.customerDetails.guests}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4 border-b border-black pb-2">Items Ordered</h3>
        <table className="w-full border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-3 text-left font-bold">Item</th>
              <th className="border border-black p-3 text-center font-bold">Qty</th>
              <th className="border border-black p-3 text-right font-bold">Unit Price</th>
              <th className="border border-black p-3 text-right font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderInfo.items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-3 font-medium">{item.name}</td>
                <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                <td className="border border-gray-300 p-3 text-right">{formatCurrency(item.price / item.quantity)}</td>
                <td className="border border-gray-300 p-3 text-right font-semibold">{formatCurrency(item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bill Summary */}
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-black mb-8">
        <div className="space-y-3">
          <div className="flex justify-between text-lg">
            <span className="font-semibold">Subtotal:</span>
            <span className="font-bold">{formatCurrency(orderInfo.bills.total)}</span>
          </div>

          {orderInfo.bills.couponCode && (
            <div className="flex justify-between text-lg text-red-600">
              <span className="font-semibold">Discount ({orderInfo.bills.couponCode}):</span>
              <span className="font-bold">-{formatCurrency(orderInfo.bills.discountAmount)}</span>
            </div>
          )}

          <div className="border-t-2 border-black pt-3">
            <div className="flex justify-between text-xl font-bold">
              <span>TOTAL:</span>
              <span>{formatCurrency(orderInfo.bills.totalWithDiscount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {orderInfo.isPaid && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-300 mb-8">
          <h3 className="font-bold text-lg mb-3 text-green-800">Payment Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">Payment Method:</span>
              <span>{orderInfo.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Status:</span>
              <span className="text-green-600 font-bold">PAID ✓</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center border-t border-gray-300 pt-6">
        <p className="text-lg font-semibold mb-2">Thank you for dining with us!</p>
        <p className="text-base mb-4">Please visit us again soon.</p>
        <p className="text-sm text-gray-600">For any queries, please contact us at (555) 123-4567</p>
      </div>
    </div>
  );
};

export default Receipt;