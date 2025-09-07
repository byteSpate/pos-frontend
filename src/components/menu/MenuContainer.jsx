import React, { useState, useEffect } from "react";
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";
import { setCustomer } from "../../redux/slices/customerSlice";
import CustomerInfo from "./CustomerInfo";
import Bill from './Bill.jsx'
import { enqueueSnackbar } from "notistack";
import { useGetMenuItemsQuery, useGetMenuCategoriesQuery } from "../../redux/api/menuApi";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const MenuContainer = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [itemCount, setItemCount] = useState(0);
  const [itemId, setItemId] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();

  const customerData = useSelector((state) => state.customer);

  // RTK Query hooks
  const { data: categoriesResponse, isLoading: categoriesLoading } = useGetMenuCategoriesQuery();
  const { data: menuData = { data: [] }, isLoading: menuLoading } = useGetMenuItemsQuery({ available: true });

  // Extract categories array from response
  const categoriesData = categoriesResponse?.data || [];

  // Category icons mapping
  const categoryIcons = {
    'Biriyani': '🍛',
    'Rice Items': '🍚',
    'Fish Items': '🐟',
    'Chicken Items': '🍗',
    'Beef Items': '🥩',
    'Mutton Items': '🍖',
    'Drinks': '🍹',
    'Fast Foods': '🍟'
  };

  // Category colors mapping
  const categoryColors = {
    'Biriyani': '#b73e3e',
    'Rice Items': '#5b45b0',
    'Fish Items': '#1d2569',
    'Chicken Items': '#285430',
    'Beef Items': '#735f32',
    'Mutton Items': '#b73e3e',
    'Drinks': '#7f167f',
    'Fast Foods': '#1d2569'
  };

  // Set first category as selected when categories load
  React.useEffect(() => {
    if (categoriesData.length > 0 && !selectedCategory) {
      setSelectedCategory(categoriesData[0]);
    }
  }, [categoriesData, selectedCategory]);

  // Extract search term from URL when component mounts or URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    } else if (location.search === '') {
      // Clear search term when URL has no search parameters
      setSearchTerm('');
    }
  }, [location.search]);

  // Filter items by selected category and search term
  const filteredItems = menuData.data?.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];
  
  const isLoading = categoriesLoading || menuLoading;

  const increment = (id) => {
    setItemId(id);
    if (itemCount >= 4) return;
    setItemCount((prev) => prev + 1);
  };

  const decrement = (id) => {
    setItemId(id);
    if (itemCount <= 0) return;
    setItemCount((prev) => prev - 1);
  };

  const handleAddToCart = (item) => {
    if (itemCount === 0) return;

    const { title, price } = item;
    const newObj = { id: Date.now().toString(), name: title, pricePerQuantity: price, quantity: itemCount, price: price * itemCount };

    dispatch(addItems(newObj));
    setItemCount(0);
  }


  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-orange-50 min-h-screen">
      {/* Categories Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-6 lg:mb-10 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 lg:mb-3">Menu Categories</h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">Browse our carefully curated selection of delicious dishes</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {categoriesData.map((category) => {
            const itemCount = menuData.data?.filter(item => item.category === category).length || 0;
            const isSelected = selectedCategory === category;
            return (
              <div
                key={category}
                className={`group cursor-pointer transition-all duration-200 ${isSelected ? 'transform scale-105' : 'hover:transform hover:scale-105'
                  }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setItemId(0);
                  setItemCount(0);
                }}
              >
                <div
                  className={`relative bg-white border-2 rounded-xl lg:rounded-2xl p-3 lg:p-4 h-32 sm:h-36 lg:h-40 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl ${isSelected
                    ? 'border-orange-400 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 transform scale-105'
                    : 'border-gray-200 hover:border-orange-200 hover:bg-gradient-to-br hover:from-white hover:to-orange-25'
                    }`}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full p-1.5 lg:p-2 shadow-xl border-2 border-white">
                      <GrRadialSelected size={12} className="lg:w-4 lg:h-4" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col items-center text-center">
                    <div className={`text-3xl sm:text-4xl lg:text-5xl mb-2 lg:mb-3 transition-all duration-300 filter drop-shadow-sm ${isSelected ? 'transform scale-110' : 'group-hover:transform group-hover:scale-110'
                      }`}>
                      {categoryIcons[category] || '🍽️'}
                    </div>
                    <h3 className={`text-sm sm:text-base lg:text-lg font-bold leading-tight transition-colors ${isSelected ? 'text-orange-800' : 'text-gray-800 group-hover:text-orange-700'
                      }`}>
                      {category}
                    </h3>
                  </div>

                  <div className="text-center mt-2 lg:mt-3">
                    <span className={`text-xs lg:text-sm font-semibold px-2 lg:px-3 py-1 lg:py-1.5 rounded-full border transition-all duration-300 ${isSelected
                      ? 'bg-orange-200 text-orange-800 border-orange-300'
                      : 'bg-gray-100 text-gray-700 border-gray-200 group-hover:bg-orange-100 group-hover:text-orange-700 group-hover:border-orange-200'
                      }`}>
                      {itemCount} items
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu Items Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Section Header */}
        {selectedCategory && (
          <div className="text-center mb-12 lg:mb-16">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl lg:text-5xl mr-3">{categoryIcons[selectedCategory]}</span>
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {selectedCategory}
              </h2>
            </div>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              {filteredItems.length} delicious {filteredItems.length === 1 ? 'option' : 'options'} to choose from
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-16">
          {filteredItems.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white rounded-xl p-12 text-center shadow-md border border-gray-200">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No items available</h3>
                <p className="text-gray-600">Check back later for delicious options in this category</p>
              </div>
            </div>
          ) : (
            filteredItems.map((item) => {
              const currentQuantity = itemId == item._id ? itemCount : 0;
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200"
                >
                  {/* Item Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={item.image?.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/f9fafb/6b7280?text=No+Image';
                      }}
                    />


                  </div>

                  {/* Item Content */}
                  <div className="p-4">
                    {/* Title and Category */}
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xl font-bold text-gray-900">
                        ৳{item.price}
                      </div>

                      <div className="flex items-center bg-gray-100 rounded-lg">
                        <button
                          onClick={() => decrement(item._id)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:text-orange-600 rounded-l-lg transition-all duration-200 disabled:opacity-50"
                          disabled={currentQuantity === 0}
                        >
                          <span className="text-lg font-bold">−</span>
                        </button>
                        <span className="mx-3 min-w-[2rem] text-center font-bold text-gray-900">
                          {currentQuantity}
                        </span>
                        <button
                          onClick={() => increment(item._id)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:text-orange-600 rounded-r-lg transition-all duration-200 disabled:opacity-50"
                          disabled={currentQuantity >= 10}
                        >
                          <span className="text-lg font-bold">+</span>
                        </button>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    {currentQuantity > 0 ? (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300"
                      >
                        Add {currentQuantity} to Cart • ৳{item.price * currentQuantity}
                      </button>
                    ) : (
                      <button
                        onClick={() => increment(item._id)}
                        className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuContainer;
