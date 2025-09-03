import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import PageLayout from "../components/layout/PageLayout";
import { useSelector } from "react-redux";
import AdminHome from "../components/home/AdminHome";
import CashierHome from "../components/home/CashierHome";
import StaffHome from "../components/home/StaffHome";

const Home = () => {
  const userData = useSelector((state) => state.user);

  useEffect(() => {
    document.title = "Kacchi Express | Home";
  }, []);

  // Render role-specific home component
  const renderRoleBasedHome = () => {
    switch (userData.role) {
      case 'Admin':
        return <AdminHome userData={userData} />;
      case 'Cashier':
        return <CashierHome userData={userData} />;
      case 'Staff':
        return <StaffHome userData={userData} />;
      default:
        return <AdminHome userData={userData} />; // Default fallback
    }
  };

  return (
    <div className="pb-20">
      <PageLayout>
        {renderRoleBasedHome()}
      </PageLayout>
      <BottomNav />
    </div>
  );
};

export default Home;