import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ roles, children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    // Esperando rehidratación → spinner, loading, etc.
    return <div>Cargando...</div>;
  }

  if (!user) {
    // No logeado → a /login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(user.rol)) {
    // Logeado pero sin permiso → Home
    return <Navigate to="/" replace />;
  }

  return children;
}
