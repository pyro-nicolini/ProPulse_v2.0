import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  authRegister,
  authLogin,
  authMe,
  authLogout,
  getToken,
} from "../api/proPulseApi";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsAdmin(user?.rol === "admin");
  }, [user?.rol]);

  const rehidratar = useCallback(async () => {
    try {
      if (!getToken()) {
        setReady(true);
        return;
      }
      const me = await authMe();
      setUser(me);
      sessionStorage.setItem("loggedUser", JSON.stringify(me));
    } catch {
      authLogout();
      sessionStorage.removeItem("loggedUser");
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
      const { user: u } = await authRegister({ nombre, email, password });
      setUser(u);
      sessionStorage.setItem("loggedUser", JSON.stringify(u));
      return u;
    } catch (err) {
      setError(err?.error || "No se pudo registrar");
      throw err;
    }
  };

  const login = async ({ email, password }) => {
    try {
      setError("");
      const { user: u } = await authLogin({ email, password });
      setUser(u);
      sessionStorage.setItem("loggedUser", JSON.stringify(u));
      return u;
    } catch (err) {
      setError(err?.error || "Credenciales inválidas");
      throw err;
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
    sessionStorage.removeItem("loggedUser");
  };

  const value = {
    user,
    isAdmin,
    ready,
    error,
    register,
    login,
    logout,
    setUser,
    setError,
    rehidratar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
