import React, { useState, useEffect } from "react";
import {
  MdTrendingUp,
  MdTrendingDown,
  MdExpandMore,
  MdAttachMoney,
  MdPeople,
  MdRestaurantMenu,
  MdTableBar,
  MdShoppingCart,
  MdCategory,
  MdEventNote,
  MdLaunch,
  MdRemove
} from "react-icons/md";
import { itemsData, metricsData } from "../../constants";
import Button from "../ui/Button";
import Card from "../ui/Card";

const Metrics = () => {
  const [timeFilter, setTimeFilter] = useState("Last 1 Month");
  const [showDropdown, setShowDropdown] = useState(false);
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netRevenue: 0
  });
  const [loading, setLoading] = useState(false);

  const timeOptions = [
    "Last 7 Days",
    "Last 1 Month",
    "Last 3 Months",
    "Last 6 Months",
    "Last 1 Year"
  ];

  // Fetch revenue data
  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/expense/revenue', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setRevenueData(data.data);
      } else {
        console.error('Failed to fetch revenue data');
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  // Icon mapping for metrics
  const getMetricIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'revenue':
        return <MdAttachMoney className="text-white text-xl" />;
      case 'outbound clicks':
        return <MdLaunch className="text-white text-xl" />;
      case 'total customer':
        return <MdPeople className="text-white text-xl" />;
      case 'event count':
        return <MdEventNote className="text-white text-xl" />;
      default:
        return <MdTrendingUp className="text-white text-xl" />;
    }
  };

  // Icon mapping for items
  const getItemIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'total categories':
        return <MdCategory className="text-white text-xl" />;
      case 'total dishes':
        return <MdRestaurantMenu className="text-white text-xl" />;
      case 'active orders':
        return <MdShoppingCart className="text-white text-xl" />;
      case 'total tables':
        return <MdTableBar className="text-white text-xl" />;
      default:
        return <MdTrendingUp className="text-white text-xl" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Overall Performance
          </h2>
          <p className="text-gray-600 mt-1">
            Track your restaurant's key performance indicators and business metrics
          </p>
        </div>

        {/* Time Filter Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setShowDropdown(!showDropdown)}
            icon={<MdExpandMore className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />}
            className="border border-gray-300"
          >
            {timeFilter}
          </Button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {timeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setTimeFilter(option);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${timeFilter === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metricsData.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Colored header bar */}
            <div
              className="h-1"
              style={{ backgroundColor: metric.color }}
            />

            <div className="p-6">
              {/* Header with icon and trend */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: metric.color }}
                  >
                    {getMetricIcon(metric.title)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {metric.title}
                    </p>
                  </div>
                </div>

                {metric.percentage && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${metric.isIncrease
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                    }`}>
                    {metric.isIncrease ? (
                      <MdTrendingUp className="w-3 h-3" />
                    ) : (
                      <MdTrendingDown className="w-3 h-3" />
                    )}
                    {metric.percentage}
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {metric.value}
                </p>
                <p className="text-xs text-gray-500">
                  vs previous period
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Expense Overview */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Financial Overview
          </h2>
          <p className="text-gray-600 mt-1">
            Real-time revenue and expense tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ৳{loading ? '...' : revenueData.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">From sales</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MdAttachMoney className="text-green-600 text-xl" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ৳{loading ? '...' : revenueData.totalExpenses.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">All categories</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <MdRemove className="text-red-600 text-xl" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Revenue</p>
                <p className={`text-2xl font-bold ${revenueData.netRevenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ৳{loading ? '...' : revenueData.netRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Revenue - Expenses</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${revenueData.netRevenue >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                {revenueData.netRevenue >= 0 ? (
                  <MdTrendingUp className="text-green-600 text-xl" />
                ) : (
                  <MdTrendingDown className="text-red-600 text-xl" />
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Item Details Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Business Overview
          </h2>
          <p className="text-gray-600 mt-1">
            Key operational metrics and inventory information
          </p>
        </div>

        {/* Item Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {itemsData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Colored header bar */}
              <div
                className="h-1"
                style={{ backgroundColor: item.color }}
              />

              <div className="p-6">
                {/* Header with icon and trend */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: item.color }}
                    >
                      {getItemIcon(item.title)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  {item.percentage && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${item.isIncrease
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                      }`}>
                      {item.isIncrease ? (
                        <MdTrendingUp className="w-3 h-3" />
                      ) : (
                        <MdTrendingDown className="w-3 h-3" />
                      )}
                      {item.percentage}
                    </div>
                  )}
                </div>

                {/* Value */}
                <div className="space-y-1">
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {item.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.title === "Total Tables" ? "active tables" : "vs previous period"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
