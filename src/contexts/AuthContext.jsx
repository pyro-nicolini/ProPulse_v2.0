import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  registerUser,
  obtenerCarrito,
  loginUser,
  getUser,
  authLogout,
  getToken,
} from "../api/proPulseApi";
import { useCart } from "./CartContext";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  // --- Rehidratar sesión al montar ---
  const rehidratar = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setReady(true);
        return;
      }

      // Fallback inmediato con lo que hay en localStorage
      const stored = localStorage.getItem("loggedUser");
      if (stored) {
        setUser(JSON.parse(stored));
      }

      // Confirmar con backend
      const u = await getUser();
      const { usuario } = u;
      setUser(usuario);
      localStorage.setItem("loggedUser", JSON.stringify(usuario));
    } catch (err) {
      if (err?.response?.status === 401) {
        authLogout();
        localStorage.removeItem("loggedUser");
      }
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    rehidratar();
  }, [rehidratar]);

  const register = async ({ nombre, email, password }) => {
    try {
      setError("");
      const { user: u, token } = await registerUser({ nombre, email, password });
      setUser(u);
      localStorage.setItem("loggedUser", JSON.stringify(u));
      localStorage.setItem("token", token);
      return u;
    } catch (err) {
      setError(err?.error || "No se pudo registrar");
      throw err;
    }
  };

  const login = async ({ email, password }) => {
    try {
      setError("");
      const { user: u, token, carrito } = await loginUser({ email, password });
      setUser(u);
      localStorage.setItem("loggedUser", JSON.stringify(u));
      localStorage.setItem("carrito", JSON.stringify(carrito));
      localStorage.setItem("token", token);
      return u;
    } catch (err) {
      setError(err?.error || "Credenciales inválidas");
      throw err;
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("carrito");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    ready,
    error,
    register,
    login,
    logout,
    rehidratar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
