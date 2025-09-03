import React, { useState } from 'react';
import { MdPayment, MdDelete, MdPrint, MdTableBar } from 'react-icons/md';
import { FaCheckDouble, FaCircle } from 'react-icons/fa';
import Table from '../ui/Table';
import Tag from '../ui/Tag';
import Button from '../ui/Button';
import { formatDateAndTime, getAvatarName } from '../../utils/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteOrder } from '../../https/index';
import { enqueueSnackbar } from 'notistack';
import { Select } from 'antd';

const OrdersTable = ({ orders = [], loading = false, onViewDetails, handleStatusChange }) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      enqueueSnackbar("Order deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (error) => {
      console.error("Error deleting order:", error);
      enqueueSnackbar(error.response?.data?.message || "Failed to delete order!", { variant: "error" });
    },
  });

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrderMutation.mutate(orderId);
    }
  };

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      width: '200px',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {getAvatarName(record.customerDetails.name)}
          </div>
          <div>
            <div className="font-medium text-slate-900">{record.customerDetails.name}</div>
            <div className="text-xs text-slate-500">
              #{Math.floor(new Date(record.orderDate).getTime())}
            </div>
          </div>
        </div>
      ),
      sorter: true,
    },
    {
      title: 'Table',
      key: 'table',
      width: '100px',
      render: (_, record) => (
        <div className="flex items-center gap-1 text-slate-700">
          <MdTableBar className="text-slate-400" />
          <span className="font-medium">{record.table.tableNo}</span>
        </div>
      ),
      sorter: true,
    },
    {
      title: 'Items',
      key: 'items',
      width: '80px',
      render: (_, record) => (
        <span className="font-medium text-slate-700">{record.items.length}</span>
      ),
      sorter: true,
    },
    {
      title: 'Status',
      key: 'orderStatus',
      width: '120px',
      render: (status, record) => getStatusTag(status, record._id),
      sorter: true,
    },
    {
      title: 'Order Date',
      key: 'orderDate',
      width: '150px',
      render: (date) => (
        <div className="text-slate-700">
          <div className="font-medium">{formatDateAndTime(date).split(' ')[0]}</div>
          <div className="text-xs text-slate-500">{formatDateAndTime(date).split(' ')[1]}</div>
        </div>
      ),
      sorter: true,
    },
    {
      title: 'Total Amount',
      key: 'total',
      width: '120px',
      render: (_, record) => (
        <div className="text-right">
          <div className="font-bold text-slate-900">৳{record.bills.totalWithDiscount?.toFixed(2)}</div>
          {record.bills.couponCode && (
            <div className="text-xs text-green-600">
              -{record.bills.couponCode}
            </div>
          )}
        </div>
      ),
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '100px',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {record.orderStatus === 'Completed' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onViewDetails(record)}
              icon={<MdPayment />}
            >
              Payment
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails(record)}
            icon={<MdPrint />}
            className="text-slate-500 hover:text-blue-600"
          >
            Print
          </Button>

          {record.orderStatus === 'In Progress' && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDeleteOrder(record._id)}
              icon={<MdDelete />}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Transform data for table
  const tableData = orders.map(order => ({
    key: order._id,
    ...order,
  }));

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={currentOrders}
          loading={loading}
          pagination={false}
          pageSize={10}
          className="min-w-full shadow-sm"
        />
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-4 py-2 mx-1 rounded-lg ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersTable;