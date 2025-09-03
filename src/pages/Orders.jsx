import React, { useState, useEffect } from "react";
import { MdOutlineReorder, MdAccessTime, MdCheckCircle, MdPending } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import BottomNav from "../components/shared/BottomNav";
import OrdersTable from "../components/orders/OrdersTable";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders, updateOrderStatus } from "../https/index";
import { enqueueSnackbar } from "notistack";
import Modal from "../components/shared/Modal";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addNotification } from "../redux/slices/notificationSlice";

const FilterButton = ({ active, onClick, children, count, color = "orange" }) => {
  const colorClasses = {
    orange: active ? "bg-orange-500 text-white" : "text-orange-600 hover:bg-orange-50",
    blue: active ? "bg-blue-500 text-white" : "text-blue-600 hover:bg-blue-50",
    green: active ? "bg-green-500 text-white" : "text-green-600 hover:bg-green-50",
    slate: active ? "bg-slate-500 text-white" : "text-slate-600 hover:bg-slate-50",
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`relative ${colorClasses[color]} transition-all duration-200`}
    >
      {children}
      {count !== undefined && (
        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${active ? "bg-white/20" : "bg-slate-200 text-slate-600"
          }`}>
          {count}
        </span>
      )}
    </Button>
  );
};

const StatsCard = ({ title, value, icon: Icon, color = "orange" }) => {
  const colorClasses = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <Card className="text-center">
      <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center mx-auto mb-3`}>
        <Icon size={24} />
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-sm text-slate-600">{title}</p>
    </Card>
  );
};

const Orders = () => {
  const [status, setStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Kacchi Express | Orders";
  }, []);

  const handleStatusChange = ({ orderId, orderStatus }) => {
    orderStatusUpdateMutation.mutate({ orderId, orderStatus });
  };

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) => updateOrderStatus({ orderId, orderStatus }),
    onSuccess: (data, variables) => {
      enqueueSnackbar(`Order #${Math.floor(new Date().getTime())} status updated to ${variables.orderStatus}!`, { variant: "success" });
      dispatch(addNotification({
        message: `Order #${Math.floor(new Date().getTime())} status updated to ${variables.orderStatus}!`, type: "success"
      }));
      queryClient.invalidateQueries(["orders"]); // Refresh order list
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to update order status!", { variant: "error" });
      dispatch(addNotification({
        message: `Failed to update order status!`, type: "error"
      }));
    }
  });

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["orders", status],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  const orders = resData?.data?.data || [];

  // Filter orders based on status
  const filteredOrders = status === "all"
    ? orders
    : orders.filter(order => {
      switch (status) {
        case "progress": return order.orderStatus === "In Progress";
        case "ready": return order.orderStatus === "Ready";
        case "completed": return order.orderStatus === "Completed";
        default: return true;
      }
    });

  // Calculate stats
  const totalOrders = orders.length;
  const inProgressOrders = orders.filter(o => o.orderStatus === "In Progress").length;
  const readyOrders = orders.filter(o => o.orderStatus === "Ready").length;
  const completedOrders = orders.filter(o => o.orderStatus === "Completed").length;

  const stats = [
    { title: "Total Orders", value: totalOrders, icon: MdOutlineReorder, color: "slate" },
    { title: "In Progress", value: inProgressOrders, icon: MdAccessTime, color: "orange" },
    { title: "Ready", value: readyOrders, icon: MdPending, color: "blue" },
    { title: "Completed", value: completedOrders, icon: MdCheckCircle, color: "green" },
  ];

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      <PageLayout
        title="Order Management"
        subtitle="Track and manage all restaurant orders"
        headerActions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            icon={<IoArrowBackOutline />}
          >
            Back
          </Button>
        }
      >
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Filter Orders</h3>
              <p className="text-sm text-slate-600">View orders by their current status</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <FilterButton
                active={status === "all"}
                onClick={() => setStatus("all")}
                count={totalOrders}
                color="slate"
              >
                All Orders
              </FilterButton>
              <FilterButton
                active={status === "progress"}
                onClick={() => setStatus("progress")}
                count={inProgressOrders}
                color="orange"
              >
                In Progress
              </FilterButton>
              <FilterButton
                active={status === "ready"}
                onClick={() => setStatus("ready")}
                count={readyOrders}
                color="blue"
              >
                Ready
              </FilterButton>
              <FilterButton
                active={status === "completed"}
                onClick={() => setStatus("completed")}
                count={completedOrders}
                color="green"
              >
                Completed
              </FilterButton>
            </div>
          </div>
        </Card>

        {/* Orders Table */}
        <div className="bg-white rounded-lg">
          <OrdersTable
            orders={filteredOrders}
            loading={isLoading}
            onViewDetails={handleViewDetails}
            handleStatusChange={handleStatusChange}
          />
        </div>

        {/* Empty State */}
        {!isLoading && filteredOrders.length === 0 && (
          <Card className="text-center py-12 mt-6">
            <MdOutlineReorder className="text-slate-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No {status !== "all" ? status.replace("progress", "in progress") : ""} orders found
            </h3>
            <p className="text-slate-600 mb-6">
              {status === "all"
                ? "No orders have been placed yet."
                : `No ${status.replace("progress", "in progress")} orders at the moment.`
              }
            </p>
            {status !== "all" && (
              <Button
                variant="outline"
                onClick={() => setStatus("all")}
              >
                View All Orders
              </Button>
            )}
          </Card>
        )}
      </PageLayout>

      <BottomNav />

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={`Order Details`}>
          <OrderDetailsModal orderInfo={selectedOrder} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default Orders;