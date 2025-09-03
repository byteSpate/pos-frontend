import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar, MdRestaurant } from "react-icons/md";
import { CiCircleMore } from "react-icons/ci";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md fade-in slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </Card>
    </div>
  );
};

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setName('');
    setPhone('');
    setGuestCount(1);
  };

  const increment = () => {
    if (guestCount >= 8) return;
    setGuestCount((prev) => prev + 1);
  };

  const decrement = () => {
    if (guestCount <= 1) return;
    setGuestCount((prev) => prev - 1);
  };

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    if (!name.trim()) return;
    dispatch(setCustomer({ name: name.trim(), phone, guests: guestCount }));
    closeModal();
    navigate("/tables");
  };

  // Filter navigation items based on user role
  const allNavItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/orders', icon: MdOutlineReorder, label: 'Orders' },
    { path: '/tables', icon: MdTableBar, label: 'Tables' },
    { path: '/more', icon: CiCircleMore, label: 'More' },
  ];

  const navItems = userData.role === 'Staff'
    ? allNavItems.filter(item => item.path === '/' || item.path === '/more')
    : allNavItems;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-40">
        <div className="flex justify-around items-center py-2 px-4 relative">
          {navItems.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              onClick={() => path !== '/more' && navigate(path)}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 min-w-[70px] ${isActive(path)
                  ? "bg-orange-100 text-orange-600"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}

          {/* Floating Action Button - Hide for Staff role */}
          {userData.role !== 'Staff' && (
            <button
              disabled={isActive("/tables") || isActive("/menu")}
              onClick={openModal}
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              <MdRestaurant size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Create Order Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create New Order">
        <div className="space-y-6">
          <Input
            label="Customer Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter customer name"
            variant="filled"
          />

          <Input
            label="Customer Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+880-9999999999"
            type="tel"
            variant="filled"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Number of Guests
            </label>
            <div className="flex items-center justify-between bg-slate-100 px-4 py-3 rounded-lg">
              <button
                onClick={decrement}
                className="w-10 h-10 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-orange-600 font-bold text-lg"
              >
                −
              </button>
              <div className="text-center">
                <span className="text-2xl font-bold text-slate-900">{guestCount}</span>
                <p className="text-sm text-slate-500">
                  {guestCount === 1 ? 'Guest' : 'Guests'}
                </p>
              </div>
              <button
                onClick={increment}
                className="w-10 h-10 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-orange-600 font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={closeModal}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateOrder}
              disabled={!name.trim()}
              className="flex-1"
            >
              Create Order
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BottomNav;