import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addTable } from "../../https";
import { enqueueSnackbar } from "notistack";

const AddTableModalContent = ({ setIsTableModalOpen }) => {
  const [tableData, setTableData] = useState({
    tableNo: "",
    seats: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(tableData);
    tableMutation.mutate(tableData);
  };

  const tableMutation = useMutation({
    mutationFn: (reqData) => addTable(reqData),
    onSuccess: (res) => {
        setIsTableModalOpen(false);
        const { data } = res;
        enqueueSnackbar(data.message, { variant: "success" })
    },
    onError: (error) => {
        const { data } = error.response;
        enqueueSnackbar(data.message, { variant: "error" })
        console.log(error);
    }
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-10">
      <div>
        <label className="block text-gray-700 mb-2 mt-3 text-sm font-medium">
          Table Number
        </label>
        <div className="flex item-center rounded-lg p-3 px-4 bg-gray-100 border border-gray-300">
          <input
            type="number"
            name="tableNo"
            value={tableData.tableNo}
            onChange={handleInputChange}
            className="bg-transparent flex-1 text-gray-900 focus:outline-none"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-700 mb-2 mt-3 text-sm font-medium">
          Number of Seats
        </label>
        <div className="flex item-center rounded-lg p-3 px-4 bg-gray-100 border border-gray-300">
          <input
            type="number"
            name="seats"
            value={tableData.seats}
            onChange={handleInputChange}
            className="bg-transparent flex-1 text-gray-900 focus:outline-none"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg mt-10 mb-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold"
      >
        Add Table
      </button>
    </form>
  );
};

export default AddTableModalContent;