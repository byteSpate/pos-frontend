import React, { useState, useEffect } from "react";
import { FaSearch, FaUserCircle, FaBell } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import KacchiExpressLogo from "../ui/Logo";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { markAllAsRead, markAsRead } from "../../redux/slices/notificationSlice";
import Button from "../ui/Button";

const Header = () => {
  const userData = useSelector((state) => state.user);
  const { notifications, unreadCount } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead({ id }));
  };

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: (data) => {
      console.log(data);
      dispatch(removeUser());
      navigate("/auth");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleSearch = () => {
    // Don't search if the search term is empty or only whitespace
    if (!searchTerm || !searchTerm.trim()) return;
    
    const trimmedSearchTerm = searchTerm.trim();
    // Determine which page we're on to redirect appropriately
    const path = location.pathname;
    
    if (path.includes('/menu') || path === '/') {
      // If on menu page or home, search in menu
      navigate(`/menu?search=${encodeURIComponent(trimmedSearchTerm)}`);
    } else if (path.includes('/orders')) {
      // If on orders page, search in orders
      navigate(`/orders?search=${encodeURIComponent(trimmedSearchTerm)}`);
    } else {
      // Default to menu search
      navigate(`/menu?search=${encodeURIComponent(trimmedSearchTerm)}`);
    }
  };
  
  // Extract search param from URL when page loads
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchParam = searchParams.get('search');
    
    if (searchParam) {
      setSearchTerm(searchParam);
    } else if (location.search === '') {
      // Clear search term when URL has no search parameters
      setSearchTerm('');
    }
  }, [location.search]);

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center py-4 px-6 lg:px-8">
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <KacchiExpressLogo size="md" />
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Kacchi Express
            </h1>
            <p className="text-xs text-slate-500 font-medium">POS System</p>
          </div>
        </div>

        {/* SEARCH - Only visible for Admin and Cashier roles */}
        {userData.role !== "Staff" && (
          <div className="hidden md:flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3 w-full max-w-md mx-8 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all">
            <FaSearch 
              className="text-slate-400 text-sm cursor-pointer hover:text-orange-500" 
              onClick={handleSearch}
            />
            <input
              type="text"
              placeholder="Search orders, tables, menu items..."
              className="bg-transparent outline-none text-slate-700 placeholder-slate-400 flex-1 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* USER ACTIONS */}
        <div className="flex items-center gap-3">
          {/* Dashboard Button for Admin */}
          {userData.role === "Admin" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              icon={<MdDashboard size={18} />}
              className="hidden sm:flex"
            >
              Dashboard
            </Button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleBellClick}
              className="relative p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <FaBell className="text-slate-600 text-lg" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px] h-5">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 fade-in">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      Mark All Read
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 cursor-pointer transition-colors ${!notif.isRead ? "bg-orange-50 border-l-4 border-l-orange-500" : ""
                          }`}
                        onClick={() => handleMarkAsRead(notif.id)}
                      >
                        <p className="text-sm text-slate-700 font-medium">{notif.message}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(notif.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <FaBell className="text-slate-300 text-2xl mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-3 py-2 hover:bg-slate-200 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <FaUserCircle className="text-white text-lg" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm text-slate-900 font-semibold">
                {userData.name || "User"}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {userData.role || "Role"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-500 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
              title="Logout"
            >
              <IoLogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;