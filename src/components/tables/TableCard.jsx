import React from "react";
import { MdTableBar, MdPeople, MdAccessTime } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import Card from "../ui/Card";
import Button from "../ui/Button";

const TableCard = ({ id, name, status, initials, seats }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isBooked = status === "Booked";
  
  const handleClick = () => {
    if (isBooked) return;

    const table = { tableId: id, tableNo: name };
    dispatch(updateTable({ table }));
    navigate(`/menu`);
  };

  const statusConfig = {
    Available: {
      color: "bg-green-100 text-green-700 border-green-200",
      icon: "text-green-500",
      bgColor: "hover:bg-green-50"
    },
    Booked: {
      color: "bg-orange-100 text-orange-700 border-orange-200",
      icon: "text-orange-500",
      bgColor: "bg-orange-50"
    }
  };

  const config = statusConfig[status] || statusConfig.Available;

  return (
    <Card 
      variant="default" 
      hover={!isBooked}
      className={`cursor-pointer transition-all duration-200 ${
        isBooked 
          ? "opacity-75 cursor-not-allowed" 
          : "hover:shadow-lg hover:-translate-y-1"
      } ${config.bgColor}`}
      onClick={handleClick}
    >
      <div className="text-center">
        {/* Table Icon */}
        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
          isBooked ? "bg-orange-100" : "bg-slate-100"
        }`}>
          <MdTableBar className={`text-2xl ${config.icon}`} />
        </div>

        {/* Table Info */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Table {name}
          </h3>
          <div className="flex items-center justify-center gap-1 text-slate-600 mb-2">
            <MdPeople size={16} />
            <span className="text-sm">{seats} seats</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color} mb-4`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isBooked ? "bg-orange-500" : "bg-green-500"
          }`}></div>
          {status}
        </div>

        {/* Customer Info or Action */}
        {isBooked && initials ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: getBgColor() }}
              >
                {getAvatarName(initials)}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900">{initials}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MdAccessTime size={12} />
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        ) : !isBooked ? (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={handleClick}
          >
            Select Table
          </Button>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-slate-500">Currently occupied</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TableCard;