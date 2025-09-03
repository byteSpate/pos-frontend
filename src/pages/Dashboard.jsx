import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory, MdLocalOffer } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

import RecentOrders from "../components/dashboard/RecentOrders";
import ManageCoupons from "../components/dashboard/ManageCoupons";
import ManageTablesContent from "../components/dashboard/ManageTablesContent";
import ManageMenuItems from "../components/dashboard/ManageMenuItems";
import OverViews from "../components/dashboard/OverViews";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Kacchi Express | Admin Dashboard"
  }, [])

  const [activeTab, setActiveTab] = useState("OverViews");

  const handleOpenModal = (action) => {
    if (action === "Expenses") {
      navigate('/dashboard/expenses');
      return;
    }
    setActiveTab(action); // Set active tab when a button is clicked
  };

  const tabs = [
    { label: "OverViews", icon: <MdCategory className="text-lg" />, action: "OverViews" },
    { label: "Manage Menu", icon: <BiSolidDish className="text-lg" />, action: "Manage Menu" },
    { label: "Manage Coupons", icon: <MdLocalOffer className="text-lg" />, action: "Manage Coupons" },
    { label: "Orders", action: "Orders" },
    { label: "Manage Tables", icon: <MdTableBar className="text-lg" />, action: "Add Table" },
    { label: "Expenses", icon: <MdCategory className="text-lg" />, action: "Expenses" },
  ];

  return (
    <div className=" min-h-screen font-sans">
      <div className=" mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 border-b border-gray-200">
          {tabs.map(({ label, icon, action }) => {
            const isActive = activeTab === action;
            return (
              <button
                key={action}
                onClick={() => handleOpenModal(action)}
                className={`
                  flex items-center justify-center py-3 px-6 -mb-px border-b-2 text-lg font-medium transition-colors duration-300 ease-in-out
                  ${isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"}
                `}
              >
                {icon && <span className={`mr-2 ${isActive ? "text-blue-600" : ""}`}>{icon}</span>}
                <span className="text-lg font-semibold">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          {activeTab === "OverViews" && <OverViews />}
          {activeTab === "Manage Menu" && <ManageMenuItems />}
          {activeTab === "Manage Coupons" && <ManageCoupons />}
          {activeTab === "Orders" && <RecentOrders />}
          {activeTab === "Add Table" && <ManageTablesContent />}
        </div>


      </div>
    </div>
  );
};

export default Dashboard;
