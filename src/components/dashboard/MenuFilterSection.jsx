import React from 'react';
import { MdSearch, MdFilterList } from 'react-icons/md';

const MenuFilterSection = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    availabilityFilter,
    setAvailabilityFilter,
    categories,
    itemCount
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {itemCount} items found
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search Menu Items
                        </label>
                        <div className="relative">
                            <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="text"
                                placeholder="Search by name, description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <div className="relative">
                            <MdFilterList className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg z-10" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-12 pr-10 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-gray-50 focus:bg-white transition-all duration-200 shadow-sm cursor-pointer"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category === 'All' ? '' : category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Quick filters:
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setAvailabilityFilter('')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${availabilityFilter === ''
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setAvailabilityFilter('available')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${availabilityFilter === 'available'
                                    ? 'bg-green-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Available
                        </button>
                        <button
                            onClick={() => setAvailabilityFilter('unavailable')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${availabilityFilter === 'unavailable'
                                    ? 'bg-red-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Unavailable
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuFilterSection;
