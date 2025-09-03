import { axiosWrapper } from "./axiosWrapper";

// API Endpoints

// Auth Endpoints
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = () => axiosWrapper.post("/api/user/logout");

// Table Endpoints
export const addTable = (data) => axiosWrapper.post("/api/table/", data);
export const getTables = () => axiosWrapper.get("/api/table");
export const updateTable = ({ tableId, ...tableData }) =>
  axiosWrapper.put(`/api/table/${tableId}`, tableData);
export const deleteTable = (tableId) => axiosWrapper.delete(`/api/table/${tableId}`);

// Payment Endpoints
export const processCashPayment = (data) =>
  axiosWrapper.post("/api/payment/process-order-payment", data);

export const applyCoupon = (data) =>
  axiosWrapper.post("/api/coupon/apply-coupon", data);

export const createCoupon = (data) =>
  axiosWrapper.post("/api/coupon/create-coupon", data);

export const getCoupons = () => axiosWrapper.get("/api/coupon/coupons");

export const updateCoupon = ({ couponId, ...couponData }) =>
  axiosWrapper.put(`/api/coupon/update-coupon/${couponId}`, couponData);

export const deleteCoupon = (couponId) =>
  axiosWrapper.delete(`/api/coupon/delete-coupon/${couponId}`);

// Order Endpoints
export const addOrder = (data) => axiosWrapper.post("/api/order/", data);
export const getOrders = () => axiosWrapper.get("/api/order");
export const updateOrderStatus = ({ orderId, orderStatus }) =>
  axiosWrapper.put(`/api/order/${orderId}`, { orderStatus });

export const updateOrder = ({ orderId, ...updateData }) =>
  axiosWrapper.put(`/api/order/${orderId}`, updateData);
export const cancelOrder = (orderId) => axiosWrapper.delete(`/api/order/${orderId}/cancel`); // New API for cancelling orders
export const deleteOrder = (orderId) => axiosWrapper.delete(`/api/order/${orderId}`); // New API for deleting orders
