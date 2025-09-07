import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Home, Auth, Orders, Tables, Menu, Dashboard } from "./pages";
import ExpenseManagement from "./pages/ExpenseManagement";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import Header from "./components/shared/Header";
import { useSelector} from "react-redux";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader"
import { useEffect } from "react";
import NotificationProvider from "./components/shared/NotificationProvider";

function Layout() {
  const isLoading = useLoadData();
  const location = useLocation();
  const hideHeaderRoutes = ["/auth"];
  const { isAuth, role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // If a user is logged in, but their role is not admin and they try to access /dashboard or expense pages, redirect them.
    if (isAuth && role !== "Admin" && (location.pathname === "/dashboard" || location.pathname.startsWith("/dashboard/"))) {
      navigate("/home");
    }
  }, [isAuth, role, navigate, location.pathname]);


  if (isLoading) return <FullScreenLoader />

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
        <Route
          path="/dashboard/expenses"
          element={
            <ProtectedRoutes>
              <ExpenseManagement />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard/expenses/add"
          element={
            <ProtectedRoutes>
              <AddExpense />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard/expenses/edit"
          element={
            <ProtectedRoutes>
              <EditExpense />
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" />;
  }

  return children;
}

const App = () => {
  return (
    <Router>
      <NotificationProvider>
        <Layout />
      </NotificationProvider>
    </Router>
  );
}

export default App;
