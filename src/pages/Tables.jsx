import React, { useState, useEffect } from "react";
import { MdTableBar, MdPeople, MdAccessTime } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import BottomNav from "../components/shared/BottomNav";
import TablesTable from "../components/tables/TablesTable";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const FilterButton = ({ active, onClick, children, count }) => (
  <Button
    variant={active ? "primary" : "ghost"}
    size="sm"
    onClick={onClick}
    className={`relative ${active ? "" : "text-slate-600 hover:text-slate-900"}`}
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

const StatsCard = ({ title, value, icon: Icon, color = "orange" }) => {
  const colorClasses = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
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

const Tables = () => {
  const [status, setStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Kacchi Express | Tables";
  }, []);

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  const tables = resData?.data?.data || [];

  // Filter tables based on status
  const filteredTables = status === "all"
    ? tables
    : tables.filter(table =>
      status === "booked" ? table.status === "Booked" : table.status === "Available"
    );

  // Calculate stats
  const totalTables = tables.length;
  const bookedTables = tables.filter(t => t.status === "Booked").length;
  const availableTables = totalTables - bookedTables;
  const occupancyRate = totalTables > 0 ? Math.round((bookedTables / totalTables) * 100) : 0;

  const stats = [
    { title: "Total Tables", value: totalTables, icon: MdTableBar, color: "blue" },
    { title: "Available", value: availableTables, icon: MdTableBar, color: "green" },
    { title: "Occupied", value: bookedTables, icon: MdPeople, color: "orange" },
    { title: "Occupancy", value: `${occupancyRate}%`, icon: MdAccessTime, color: "red" },
  ];

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      <PageLayout
        title="Table Management"
        subtitle="Monitor and manage your restaurant tables"
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
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Filter Tables</h3>
              <p className="text-sm text-slate-600">View tables by their current status</p>
            </div>
            <div className="flex items-center gap-2">
              <FilterButton
                active={status === "all"}
                onClick={() => setStatus("all")}
                count={totalTables}
              >
                All Tables
              </FilterButton>
              <FilterButton
                active={status === "available"}
                onClick={() => setStatus("available")}
                count={availableTables}
              >
                Available
              </FilterButton>
              <FilterButton
                active={status === "booked"}
                onClick={() => setStatus("booked")}
                count={bookedTables}
              >
                Occupied
              </FilterButton>
            </div>
          </div>
        </Card>

        {/* Tables Table */}
        <div className="bg-white rounded-lg">
          <TablesTable
            tables={filteredTables}
            loading={isLoading}
          />
        </div>

        {/* Empty State */}
        {!isLoading && filteredTables.length === 0 && (
          <Card className="text-center py-12 mt-6">
            <MdTableBar className="text-slate-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No {status !== "all" ? status : ""} tables found
            </h3>
            <p className="text-slate-600 mb-6">
              {status === "all"
                ? "No tables are currently set up in the system."
                : `No ${status} tables at the moment.`
              }
            </p>
            {status !== "all" && (
              <Button
                variant="outline"
                onClick={() => setStatus("all")}
              >
                View All Tables
              </Button>
            )}
          </Card>
        )}
      </PageLayout>
      <BottomNav />
    </div>
  );
};

export default Tables;