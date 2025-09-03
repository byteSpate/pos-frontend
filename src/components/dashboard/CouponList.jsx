import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCoupons } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { formatDate } from "../../utils";
import { Table, Tag } from 'antd';

const CouponList = () => {
  const { data: resData, isLoading, isError } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const response = await getCoupons();
      return response.data; // Assuming API returns { data: [...] }
    },
  });

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Discount %',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      render: (text) => `${text}%`,
    },
    {
      title: 'Expires On',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      render: (text) => formatDate(new Date(text)),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Yes' : 'No'}
        </Tag>
      ),
    },
  ];

  if (isLoading) {
    return <div className="text-gray-800 p-6 container mx-auto">Loading Coupons...</div>;
  }

  if (isError) {
    console.error("Error fetching coupons:", resData);
    enqueueSnackbar("Failed to fetch coupons!", { variant: "error" });
    return <div className="text-gray-800 p-6 container mx-auto">Error loading coupons.</div>;
  }

  const coupons = resData.data || [];

  const dataSource = coupons.map((coupon) => ({
    key: coupon._id,
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
    expirationDate: coupon.expirationDate,
    isActive: coupon.isActive,
  }));

  return (
    <div className="mx-auto p-4 mt-4">
      <h2 className="text-gray-800 text-xl font-semibold mb-4">All Coupons</h2>
      <Table 
        columns={columns} 
        dataSource={dataSource} 
        pagination={{ pageSize: 5 }}
        className="ant-table-striped"
        rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
      />
      {coupons.length === 0 && !isLoading && (
        <p className="text-gray-600 text-center mt-4">No coupons found.</p>
      )}
    </div>
  );
};

export default CouponList;