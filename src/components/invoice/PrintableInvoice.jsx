import React from 'react';

const PrintableInvoice = ({ orderInfo }) => {
  return (
    <div className="printable-invoice">
      {/* Restaurant Header */}
      <div className="invoice-header">
        <div className="restaurant-info">
          <h1 className="restaurant-name">Kacchi Express</h1>
          <p className="restaurant-address">Nowapara,Abhaynagar,Jessore</p>
          <p className="restaurant-contact">Phone: +880 1922315967 | Email: kacchi.express@gmail.com</p>
        </div>
      </div>

      {/* Invoice Title */}
      <div className="invoice-title">
        <h2>ORDER RECEIPT</h2>
        <p className="thank-you">Thank you for your order!</p>
      </div>

      {/* Order Information */}
      <div className="order-info">
        <div className="info-row">
          <span className="label">Order ID:</span>
          <span className="value">{Math.floor(new Date(orderInfo.orderDate).getTime())}</span>
        </div>
        <div className="info-row">
          <span className="label">Date:</span>
          <span className="value">{new Date(orderInfo.orderDate).toLocaleDateString()}</span>
        </div>
        <div className="info-row">
          <span className="label">Time:</span>
          <span className="value">{new Date(orderInfo.orderDate).toLocaleTimeString()}</span>
        </div>
        <div className="info-row">
          <span className="label">Table:</span>
          <span className="value">{orderInfo.table?.tableNo || 'N/A'}</span>
        </div>
      </div>

      {/* Customer Information */}
      <div className="customer-info">
        <h3>Customer Details</h3>
        <div className="info-row">
          <span className="label">Name:</span>
          <span className="value">{orderInfo.customerDetails.name}</span>
        </div>
        <div className="info-row">
          <span className="label">Phone:</span>
          <span className="value">{orderInfo.customerDetails.phone}</span>
        </div>
        <div className="info-row">
          <span className="label">Guests:</span>
          <span className="value">{orderInfo.customerDetails.guests}</span>
        </div>
      </div>

      {/* Items Table */}
      <div className="items-section">
        <h3>Items Ordered</h3>
        <table className="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orderInfo.items.map((item, index) => (
              <tr key={index}>
                <td className="item-name">{item.name}</td>
                <td className="item-qty">{item.quantity}</td>
                <td className="item-price">৳{(item.price / item.quantity).toFixed(2)}</td>
                <td className="item-total">৳{item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bill Summary */}
      <div className="bill-summary">
        <div className="summary-row">
          <span className="label">Subtotal:</span>
          <span className="value">৳{orderInfo.bills.total.toFixed(2)}</span>
        </div>
        
        {orderInfo.bills.couponCode && (
          <div className="summary-row discount">
            <span className="label">Discount ({orderInfo.bills.couponCode}):</span>
            <span className="value">-৳{orderInfo.bills.discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="summary-row total">
          <span className="label">TOTAL:</span>
          <span className="value">৳{orderInfo.bills.totalWithDiscount.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Information */}
      {orderInfo.isPaid && (
        <div className="payment-info">
          <h3>Payment Details</h3>
          <div className="info-row">
            <span className="label">Payment Method:</span>
            <span className="value">{orderInfo.paymentMethod}</span>
          </div>
          <div className="info-row">
            <span className="label">Status:</span>
            <span className="value paid">PAID</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="invoice-footer">
        <p className="footer-text">Thank you for dining with us!</p>
        <p className="footer-text">Please visit us again soon.</p>
        
      </div>
    </div>
  );
};

export default PrintableInvoice;