import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaNotesMedical } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../redux/slices/cartSlice";

const CartInfo = () => {
  const cartData = useSelector((state) => state.cart);
  const scrolLRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if(scrolLRef.current){
      scrolLRef.current.scrollTo({
        top: scrolLRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  },[cartData]);

  const handleRemove = (itemId) => {
    dispatch(removeItem(itemId));
  }

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4 bg-white">
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900">Order Details</h2>
        {cartData.length > 0 && (
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs lg:text-sm font-medium">
            {cartData.length} items
          </span>
        )}
      </div>
      
      <div className="overflow-y-auto scrollbar-hide h-[200px] lg:h-[350px]" ref={scrolLRef}>
        {cartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-4 lg:py-8">
            <div className="text-3xl lg:text-4xl mb-2 lg:mb-3">🛒</div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-1 lg:mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-xs lg:text-sm">Start adding items from the menu!</p>
          </div>
        ) : (
          <div className="space-y-2 lg:space-y-3">
            {cartData.map((item) => {
              return (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 lg:p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2 lg:mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-xs lg:text-sm leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1">
                        ৳{item.pricePerQuantity} each
                      </p>
                    </div>
                    <div className="text-right ml-2 lg:ml-3">
                      <span className="bg-gray-100 text-gray-700 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full text-xs font-medium">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1 lg:p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <RiDeleteBin2Fill size={14} className="lg:w-4 lg:h-4" />
                      </button>
                      <button
                        className="p-1 lg:p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Add notes"
                      >
                        <FaNotesMedical size={14} className="lg:w-4 lg:h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm lg:text-base">৳{item.price}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartInfo;
