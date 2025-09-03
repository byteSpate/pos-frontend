import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createCoupon } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/slices/notificationSlice";

const CreateCoupon = ({ setIsModalOpen }) => {
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [expirationDate, setExpirationDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const dispatch = useDispatch();

  const createCouponMutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: (data) => {
      enqueueSnackbar(data.data.message, { variant: "success" });
      dispatch(addNotification({
        message: `Coupon '${data.data.coupon.code}' created successfully!`, type: "success"
      }));
      setCode("");
      setDiscountPercentage(0);
      setExpirationDate("");
      setIsActive(true);
      setIsModalOpen(false); // Close modal on success
    },
    onError: (error) => {
      console.error("Error creating coupon:", error.response);
      enqueueSnackbar(error.response?.data?.message || "Failed to create coupon!", { variant: "error" });
      dispatch(addNotification({
        message: `Failed to create coupon: ${error.response?.data?.message || "Unknown error"}`, type: "error"
      }));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const couponData = {
      code,
      discountPercentage: Number(discountPercentage),
      expirationDate: new Date(expirationDate).toISOString(),
      isActive,
    };
    createCouponMutation.mutate(couponData);
  };

  return (
    <div className="bg-white p-6 rounded-lg  mt-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Coupon</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
          <input
            type="text"
            id="code"
            className="w-full p-2 rounded-md bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
          <input
            type="number"
            id="discountPercentage"
            className="w-full p-2 rounded-md bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            required
            min="0"
            max="100"
          />
        </div>
        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
          <input
            type="date"
            id="expirationDate"
            className="w-full p-2 rounded-md bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center col-span-1 md:col-span-2">
          <input
            type="checkbox"
            id="isActive"
            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Is Active</label>
        </div>
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-yellow-400 px-4 py-3 rounded-lg text-gray-900 font-semibold text-lg hover:bg-yellow-500 transition-colors duration-300"
        >
          Create Coupon
        </button>
      </form>
    </div>
  );
};

export default CreateCoupon;