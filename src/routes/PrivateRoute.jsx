import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ roles, children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  // 🌀 Esperando rehidratación del contexto Auth
  if (!ready) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-charcoal text-white">
        <div className="metal card-metal radius p-3 text-center shadow-lg">
          <h3 className="text-gradient-primary font-bold mb-1">Cargando...</h3>
          <p className="text-sm text-gray-300">Verificando sesión activa ⚙️</p>
        </div>
      </div>
    );
  }

  // 🚫 Usuario no logeado → redirigir a /login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🔒 Usuario logeado pero sin permisos suficientes
  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Usuario autorizado
  return children;
}
