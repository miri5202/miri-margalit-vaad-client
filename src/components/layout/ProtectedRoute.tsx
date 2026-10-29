import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// עמודים שרק משתמש מחובר יכול לראות
function ProtectedRoute() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
