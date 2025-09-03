import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/menu/MenuContainer";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";

const Menu = () => {

  useEffect(() => {
    document.title = "Kacchi Express | Menu"
  }, [])

  const customerData = useSelector((state) => state.customer);

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BackButton />
              <h1 className="text-gray-800 text-xl font-bold">
                Menu
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-2 rounded-full">
                <MdRestaurantMenu className="text-orange-600 text-lg" />
              </div>
              <div className="hidden sm:block">
                <h2 className="text-sm text-gray-800 font-semibold">
                  {customerData.customerName || "Customer"}
                </h2>
                <p className="text-xs text-gray-500">
                  Table: {customerData.table?.tableNo || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Container */}
        <div className="pb-20">
          <MenuContainer />
        </div>

        {/* Mobile Cart - Fixed Bottom Sheet */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="flex flex-col max-h-80">
            <div className="flex-1 overflow-hidden">
              <CartInfo />
            </div>
            <div className="flex-shrink-0 border-t border-gray-200">
              <Bill />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-6">
        {/* Left Div */}
        <div className="flex-[3]">
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 lg:px-10 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BackButton />
                <h1 className="text-gray-800 text-2xl lg:text-3xl font-bold">
                  Menu
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <MdRestaurantMenu className="text-orange-600 text-2xl" />
                  </div>
                  <div className="flex flex-col items-start">
                    <h2 className="text-lg text-gray-800 font-semibold">
                      {customerData.customerName || "Customer Name"}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                      Table: {customerData.table?.tableNo || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <MenuContainer />
        </div>
        {/* Right Div */}
        <div className="flex-[1] bg-white shadow-lg rounded-xl m-4 h-fit border border-gray-200">
          {/* Cart Items */}
          <CartInfo />
          <hr className="border-gray-200" />
          {/* Bills */}
          <Bill />
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default Menu;
