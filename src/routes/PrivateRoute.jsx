import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
export default function PrivateRoute({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();
  // No logeado → a /login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  //  debe matchear Con roles
  if (Array.isArray(roles) && roles.length > 0) {
    if (!roles.includes(user.rol)) {
      // Logeado pero sin permiso → Home
      return <Navigate to="/" replace />;
    }
  }
  return children;
}
