import React from 'react';
import { MdTableBar, MdPeople, MdAccessTime } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import Table from '../ui/Table';
import Tag from '../ui/Tag';
import Button from '../ui/Button';
import { getAvatarName, getBgColor } from "../../utils";

const TablesTable = ({ tables = [], loading = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSelectTable = (table) => {
    if (table.status === "Booked") return;

    const tableData = { tableId: table._id, tableNo: table.tableNo };
    dispatch(updateTable({ table: tableData }));
    navigate(`/menu`);
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      'Available': { color: 'success', icon: <MdTableBar className="text-xs" /> },
      'Booked': { color: 'warning', icon: <MdPeople className="text-xs" /> },
    };

    const config = statusConfig[status] || { color: 'default', icon: <MdTableBar className="text-xs" /> };
    
    return (
      <Tag color={config.color} icon={config.icon}>
        {status}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Table',
      key: 'tableNo',
      width: '120px',
      render: (tableNo) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <MdTableBar className="text-slate-600 text-lg" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Table {tableNo}</div>
          </div>
        </div>
      ),
      sorter: true,
    },
    {
      title: 'Seats',
      key: 'seats',
      width: '100px',
      render: (seats) => (
        <div className="flex items-center gap-1 text-slate-700">
          <MdPeople className="text-slate-400" />
          <span className="font-medium">{seats}</span>
        </div>
      ),
      sorter: true,
    },
    {
      title: 'Status',
      key: 'status',
      width: '120px',
      render: (status) => getStatusTag(status),
      sorter: true,
    },
    {
      title: 'Current Customer',
      key: 'customer',
      width: '200px',
      render: (_, record) => {
        const customerName = record?.currentOrder?.customerDetails?.name;
        
        if (!customerName || record.status === 'Available') {
          return (
            <span className="text-slate-400 italic">No customer</span>
          );
        }

        return (
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
              style={{ backgroundColor: getBgColor() }}
            >
              {getAvatarName(customerName)}
            </div>
            <div>
              <div className="font-medium text-slate-900">{customerName}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <MdAccessTime className="text-xs" />
                Active
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '150px',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {record.status === 'Available' ? (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleSelectTable(record)}
            >
              Select Table
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              Occupied
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Transform data for table
  const tableData = tables.map(table => ({
    key: table._id,
    ...table,
  }));

  return (
    <Table
      columns={columns}
      data={tableData}
      loading={loading}
      pagination={true}
      pageSize={12}
      className="shadow-sm"
      onRowClick={(record) => {
        if (record.status === 'Available') {
          handleSelectTable(record);
        }
      }}
    />
  );
};

export default TablesTable;