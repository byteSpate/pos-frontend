import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Home, Auth, Orders, Tables, Menu, Dashboard } from "./pages";
import Header from "./components/shared/Header";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader";

// Mock hooks for preview
const mockUseLoadData = () => false;

// Mock Redux state for preview
const mockUseSelector = (selector) => {
  const mockState = {
    user: {
      isAuth: true,
      name: "John Doe",
      role: "Admin"
    },
    notification: {
      notifications: [
        {
          id: 1,
          message: "New order received from Table 5",
          timestamp: new Date().toISOString(),
          isRead: false
        },
        {
          id: 2,
          message: "Order #1234 is ready for pickup",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          isRead: true
        }
      ],
      unreadCount: 1
    },
    customer: {
      customerName: "John Smith",
      table: { tableNo: "A-1" }
    }
  };
  return selector(mockState);
};

function Layout() {
  const isLoading = mockUseLoadData();
  const location = useLocation();
  const hideHeaderRoutes = ["/auth"];
  const { isAuth } = mockUseSelector(state => state.user);

  if(isLoading) return <FullScreenLoader />

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes>
              <Orders />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/tables"
          element={
            <ProtectedRoutes>
              <Tables />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoutes>
              <Menu />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
            <p className="text-slate-600">Page not found</p>
          </div>
        </div>} />
      </Routes>
    </>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth } = mockUseSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;