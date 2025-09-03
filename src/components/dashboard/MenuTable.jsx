import React from 'react';
import { MdEdit, MdDelete, MdRestaurantMenu } from 'react-icons/md';
import { BiSolidDish } from 'react-icons/bi';
import Button from '../ui/Button';

const MenuTable = ({
    items,
    isLoading,
    onEdit,
    onToggleAvailability,
    onDelete
}) => {
    // Skeleton loader component
    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="px-6 py-4">
                <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg mr-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
            </td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
            <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
            <td className="px-6 py-4">
                <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
            </td>
        </tr>
    );

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Item', 'Category', 'Price', 'Status', 'Actions'].map((header, index) => (
                                <th key={index} className="px-6 py-3">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <SkeletonRow key={index} />
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12">
                                            <img
                                                className="h-12 w-12 rounded-lg object-cover"
                                                src={item.image?.url}
                                                alt={item.title}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                                                }}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-full w-fit">
                                        <MdRestaurantMenu className="text-blue-600 text-sm" />
                                        <span className="text-xs font-medium text-blue-700">{item.category}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-orange-600">৳{item.price}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.isAvailable
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {item.isAvailable ? 'Available' : 'Unavailable'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(item)}
                                            icon={<MdEdit />}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onToggleAvailability(item)}
                                            className={`${item.isAvailable
                                                ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                                                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                                                }`}
                                        >
                                            {item.isAvailable ? 'Hide' : 'Show'}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(item)}
                                            icon={<MdDelete />}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Empty state component
export const MenuEmptyState = ({
    searchTerm,
    selectedCategory,
    availabilityFilter,
    onClearFilters,
    onAddItem
}) => {
    const hasFilters = searchTerm || selectedCategory || availabilityFilter;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-center py-16 px-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 transform scale-150"></div>
                    <div className="relative p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full inline-block">
                        <BiSolidDish className="h-16 w-16 text-gray-400" />
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">No menu items found</h3>
                    <div className="space-y-2">
                        <p className="text-gray-600">
                            {hasFilters
                                ? "We couldn't find any items matching your search criteria."
                                : "Your menu is empty. Start by adding your first delicious item!"
                            }
                        </p>
                        {hasFilters && (
                            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                                {searchTerm && (
                                    <span className="px-3 py-1 bg-gray-100 rounded-full">
                                        Search: "{searchTerm}"
                                    </span>
                                )}
                                {selectedCategory && (
                                    <span className="px-3 py-1 bg-gray-100 rounded-full">
                                        Category: {selectedCategory}
                                    </span>
                                )}
                                {availabilityFilter && (
                                    <span className="px-3 py-1 bg-gray-100 rounded-full">
                                        Status: {availabilityFilter}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    {hasFilters ? (
                        <Button
                            variant="primary"
                            onClick={onClearFilters}
                            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                        >
                            Clear Filters
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            <Button
                                variant="primary"
                                onClick={onAddItem}
                                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                                icon={<BiSolidDish />}
                            >
                                Add Your First Menu Item
                            </Button>
                            <p className="text-xs text-gray-500">
                                Start building your menu with amazing dishes
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuTable;
