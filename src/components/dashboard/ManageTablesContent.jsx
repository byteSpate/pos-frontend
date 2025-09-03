import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTable, getTables, updateTable, deleteTable } from "../../https";
import { enqueueSnackbar } from "notistack";
import { MdEdit, MdDelete, MdAdd, MdTableBar, MdPeople } from "react-icons/md";
import Button from "../ui/Button";
import Modal from "../shared/Modal";

const ManageTablesContent = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [formData, setFormData] = useState({
        tableNo: "",
        seats: "",
    });

    const queryClient = useQueryClient();

    // Get tables query
    const { data: resData, isLoading } = useQuery({
        queryKey: ["tables"],
        queryFn: getTables,
    });

    const tables = resData?.data?.data || [];

    // Add table mutation
    const addTableMutation = useMutation({
        mutationFn: addTable,
        onSuccess: (res) => {
            setIsAddModalOpen(false);
            setFormData({ tableNo: "", seats: "" });
            queryClient.invalidateQueries(["tables"]);
            enqueueSnackbar(res.data.message, { variant: "success" });
        },
        onError: (error) => {
            const message = error.response?.data?.message || "Failed to add table";
            enqueueSnackbar(message, { variant: "error" });
        }
    });

    // Update table mutation
    const updateTableMutation = useMutation({
        mutationFn: ({ tableId, ...data }) => updateTable({ tableId, ...data }),
        onSuccess: (res) => {
            setIsEditModalOpen(false);
            setSelectedTable(null);
            setFormData({ tableNo: "", seats: "" });
            queryClient.invalidateQueries(["tables"]);
            enqueueSnackbar(res.data.message, { variant: "success" });
        },
        onError: (error) => {
            const message = error.response?.data?.message || "Failed to update table";
            enqueueSnackbar(message, { variant: "error" });
        }
    });

    // Delete table mutation
    const deleteTableMutation = useMutation({
        mutationFn: deleteTable,
        onSuccess: (res) => {
            setIsDeleteModalOpen(false);
            setSelectedTable(null);
            queryClient.invalidateQueries(["tables"]);
            enqueueSnackbar(res.data.message, { variant: "success" });
        },
        onError: (error) => {
            const message = error.response?.data?.message || "Failed to delete table";
            enqueueSnackbar(message, { variant: "error" });
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddTable = (e) => {
        e.preventDefault();
        addTableMutation.mutate(formData);
    };

    const handleEditTable = (e) => {
        e.preventDefault();
        updateTableMutation.mutate({
            tableId: selectedTable._id,
            ...formData
        });
    };

    const openEditModal = (table) => {
        setSelectedTable(table);
        setFormData({
            tableNo: table.tableNo,
            seats: table.seats,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (table) => {
        setSelectedTable(table);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteTable = () => {
        deleteTableMutation.mutate(selectedTable._id);
    };

    const resetAddForm = () => {
        setFormData({ tableNo: "", seats: "" });
        setIsAddModalOpen(false);
    };

    const resetEditForm = () => {
        setFormData({ tableNo: "", seats: "" });
        setSelectedTable(null);
        setIsEditModalOpen(false);
    };

    const resetDeleteForm = () => {
        setSelectedTable(null);
        setIsDeleteModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manage Tables</h2>
                    <p className="text-gray-600">Add, edit, or delete restaurant tables</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsAddModalOpen(true)}
                    icon={<MdAdd />}
                >
                    Add New Table
                </Button>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tables.map((table) => (
                    <div
                        key={table._id}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="p-6">
                            {/* Table Icon and Info */}
                            <div className="text-center mb-4">
                                <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center ${table.status === 'Booked' ? 'bg-orange-100' : 'bg-blue-100'
                                    }`}>
                                    <MdTableBar className={`text-2xl ${table.status === 'Booked' ? 'text-orange-600' : 'text-blue-600'
                                        }`} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Table {table.tableNo}
                                </h3>
                                <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                                    <MdPeople size={16} />
                                    <span className="text-sm">{table.seats} seats</span>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="text-center mb-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${table.status === 'Available'
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-orange-100 text-orange-700 border border-orange-200'
                                    }`}>
                                    <div className={`w-2 h-2 rounded-full mr-2 ${table.status === 'Available' ? 'bg-green-500' : 'bg-orange-500'
                                        }`}></div>
                                    {table.status}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditModal(table)}
                                    icon={<MdEdit />}
                                    className="flex-1"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openDeleteModal(table)}
                                    icon={<MdDelete />}
                                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    disabled={table.status === 'Booked'}
                                >
                                    Delete
                                </Button>
                            </div>

                            {table.status === 'Booked' && (
                                <p className="text-xs text-gray-500 text-center mt-2">
                                    Cannot delete booked table
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {tables.length === 0 && (
                <div className="text-center py-12">
                    <MdTableBar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tables</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new table.</p>
                </div>
            )}

            {/* Add Table Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={resetAddForm}
                title="Add New Table"
            >
                <form onSubmit={handleAddTable} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2 text-sm font-medium">
                            Table Number
                        </label>
                        <input
                            type="number"
                            name="tableNo"
                            value={formData.tableNo}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 text-sm font-medium">
                            Number of Seats
                        </label>
                        <input
                            type="number"
                            name="seats"
                            value={formData.seats}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            min="1"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={resetAddForm}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={addTableMutation.isPending}
                            className="flex-1"
                        >
                            Add Table
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Table Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={resetEditForm}
                title="Edit Table"
            >
                <form onSubmit={handleEditTable} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2 text-sm font-medium">
                            Table Number
                        </label>
                        <input
                            type="number"
                            name="tableNo"
                            value={formData.tableNo}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 text-sm font-medium">
                            Number of Seats
                        </label>
                        <input
                            type="number"
                            name="seats"
                            value={formData.seats}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            min="1"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={resetEditForm}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={updateTableMutation.isPending}
                            className="flex-1"
                        >
                            Update Table
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={resetDeleteForm}
                title="Delete Table"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete Table {selectedTable?.tableNo}? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={resetDeleteForm}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleDeleteTable}
                            loading={deleteTableMutation.isPending}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                            Delete Table
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageTablesContent;
