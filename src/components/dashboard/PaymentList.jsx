import React from 'react';
import { Table, Tag, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const PaymentList = () => {
  const columns = [
    {
      title: 'Payment ID',
      dataIndex: 'paymentId',
      key: 'paymentId',
      render: (text) => `#${text}`,
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => `#${text}`,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `৳${text}`,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: (text) => {
        let color = text === 'Cash' ? 'green' : 'blue';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'Completed' ? 'green' : 'volcano';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <Space>
          <CalendarOutlined />
          {text}
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      paymentId: '10001',
      orderId: '20001',
      amount: 250,
      method: 'Cash',
      status: 'Completed',
      date: '2023-10-26',
    },
    {
      key: '2',
      paymentId: '10002',
      orderId: '20002',
      amount: 150,
      method: 'Card',
      status: 'Pending',
      date: '2023-10-25',
    },
    {
      key: '3',
      paymentId: '10003',
      orderId: '20003',
      amount: 300,
      method: 'Cash',
      status: 'Completed',
      date: '2023-10-24',
    },
    {
      key: '4',
      paymentId: '10004',
      orderId: '20004',
      amount: 500,
      method: 'Card',
      status: 'Completed',
      date: '2023-10-23',
    },
  ];

  return (
    <div className="container mx-auto p-4 rounded-lg bg-white shadow-md mt-4">
      <h2 className="text-gray-800 text-xl font-semibold mb-4">Payment History</h2>
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={{ pageSize: 5 }} 
        scroll={{ x: 'max-content' }}
        className="ant-table-striped"
        rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
      />
      {data.length === 0 && (
        <p className="text-gray-600 text-center mt-4">No payment data found.</p>
      )}
    </div>
  );
};

export default PaymentList;