import React from 'react';
import { MdPayment, MdDelete, MdPrint, MdTableBar } from 'react-icons/md';
import { FaCheckDouble, FaCircle } from 'react-icons/fa';
import Tag from '../ui/Tag';
import Button from '../ui/Button';
import { formatDateAndTime, getAvatarName } from '../../utils/index';
import { Select } from 'antd';

const OrderCard = ({ order, handleStatusChange, onPrint, onViewDetails, onDeleteOrder }) => {

  const getStatusTag = (status, orderId) => {
    const statusConfig = {
      'In Progress': { color: 'warning', icon: <FaCircle className="text-xs" /> },
      'Ready': { color: 'success', icon: <FaCheckDouble className="text-xs" /> },
      'Completed': { color: 'success', icon: <FaCheckDouble className="text-xs" /> },
      'Pending': { color: 'info', icon: <FaCircle className="text-xs" /> },
    };

    const config = statusConfig[status] || { color: 'default', icon: <FaCircle className="text-xs" /> };
    
    return (
      <Select
        value={status}
        onChange={(value) => handleStatusChange({ orderId: orderId, orderStatus: value })}
        style={{ width: 120, borderColor: '#d9d9d9' }}
        options={[
          { value: 'In Progress', label: <span className="text-yellow-600">In Progress</span> },
          { value: 'Ready', label: <span className="text-green-600">Ready</span> },
          { value: 'Completed', label: <span className="text-blue-600">Completed</span> },
        ]}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {getAvatarName(order.customerDetails.name)}
          </div>
          <div>
            <div className="font-medium text-slate-900">{order.customerDetails.name}</div>
            <div className="text-xs text-slate-500">
              #{Math.floor(new Date(order.orderDate).getTime())}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-slate-900">৳{order.bills.totalWithDiscount?.toFixed(2)}</div>
          {order.bills.couponCode && (
            <div className="text-xs text-green-600">
              -{order.bills.couponCode}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-slate-500">Order Type</p>
          <Tag color={order.orderType === 'Dine In' ? 'blue' : 'green'}>{order.orderType}</Tag>
        </div>
        <div>
          <p className="text-slate-500">Table</p>
          <div className="flex items-center gap-1 text-slate-700">
            {order.table ? (
              <>
                <MdTableBar className="text-slate-400" />
                <span className="font-medium">{order.table.tableNo}</span>
              </>
            ) : (
              <span className="font-medium text-slate-500">Take Away</span>
            )}
          </div>
        </div>
        <div>
          <p className="text-slate-500">Items</p>
          <span className="font-medium text-slate-700">{order.items.length}</span>
        </div>
        <div>
          <p className="text-slate-500">Order Date</p>
          <div className="text-slate-700">
            <div className="font-medium">{formatDateAndTime(order.orderDate).split(' ')[0]}</div>
            <div className="text-xs text-slate-500">{formatDateAndTime(order.orderDate).split(' ')[1]}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-500">Status</p>
        {getStatusTag(order.orderStatus, order._id)}
      </div>

      <div className="flex items-center justify-end gap-2">
        {order.orderStatus === 'Completed' && !order.isPaid && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => onViewDetails(order)}
            icon={<MdPayment />}
          >
            Payment
          </Button>
        )}
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPrint(order)}
          icon={<MdPrint />}
          className="text-slate-500 hover:text-blue-600"
        >
          Print
        </Button>

        {order.orderStatus === 'In Progress' && (
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDeleteOrder(order._id)}
            icon={<MdDelete />}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;