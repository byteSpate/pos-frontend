import React, { useState } from 'react';
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdMoreVert } from 'react-icons/md';

const Table = ({ 
  columns = [], 
  data = [], 
  loading = false,
  pagination = true,
  pageSize = 10,
  onRowClick,
  className = '',
  size = 'default'
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sizeClasses = {
    small: 'text-sm',
    default: 'text-sm',
    large: 'text-base'
  };

  const paddingClasses = {
    small: 'px-3 py-2',
    default: 'px-4 py-3',
    large: 'px-6 py-4'
  };

  // Sorting logic
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = pagination ? sortedData.slice(startIndex, endIndex) : sortedData;

  const renderSortIcon = (column) => {
    if (!column.sorter) return null;
    
    const isActive = sortConfig.key === column.key;
    return (
      <span className="ml-1 inline-flex flex-col">
        <MdKeyboardArrowUp 
          className={`text-xs -mb-1 ${isActive && sortConfig.direction === 'asc' ? 'text-orange-500' : 'text-slate-300'}`} 
        />
        <MdKeyboardArrowDown 
          className={`text-xs ${isActive && sortConfig.direction === 'desc' ? 'text-orange-500' : 'text-slate-300'}`} 
        />
      </span>
    );
  };

  const renderCell = (record, column, index) => {
    if (column.render) {
      return column.render(record[column.key], record, index);
    }
    return record[column.key];
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-slate-200 overflow-hidden ${className}`}>
        <div className="animate-pulse">
          <div className="bg-slate-50 border-b border-slate-200">
            <div className="flex">
              {columns.map((_, index) => (
                <div key={index} className={`flex-1 ${paddingClasses[size]}`}>
                  <div className="h-4 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="border-b border-slate-100 last:border-b-0">
              <div className="flex">
                {columns.map((_, colIndex) => (
                  <div key={colIndex} className={`flex-1 ${paddingClasses[size]}`}>
                    <div className="h-4 bg-slate-100 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-slate-200 overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="flex">
          {columns.map((column) => (
            <div
              key={column.key}
              className={`flex-1 ${paddingClasses[size]} font-medium text-slate-700 ${
                column.sorter ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''
              } ${column.className || ''}`}
              style={{ width: column.width }}
              onClick={() => column.sorter && handleSort(column.key)}
            >
              <div className="flex items-center justify-between">
                <span className={sizeClasses[size]}>{column.title}</span>
                {renderSortIcon(column)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-slate-100">
        {paginatedData.length > 0 ? (
          paginatedData.map((record, index) => (
            <div
              key={record.key || index}
              className={`flex hover:bg-slate-50 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick && onRowClick(record, index)}
            >
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={`flex-1 ${paddingClasses[size]} ${sizeClasses[size]} text-slate-900 ${column.className || ''}`}
                  style={{ width: column.width }}
                >
                  {renderCell(record, column, index)}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-slate-400 text-4xl mb-4">📋</div>
            <p className="text-slate-500 text-lg font-medium mb-2">No data available</p>
            <p className="text-slate-400 text-sm">There are no records to display</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                const isActive = page === currentPage;
                
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm border rounded transition-colors ${
                        isActive
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-2 text-slate-400">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;