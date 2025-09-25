import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  obtenerCarrito,
  agregarItemCarrito,
  disminuirItemCarrito,
  eliminarItemDelCarrito,
  crearPedido,
  pedidosDelUser
} from "../api/proPulseApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {
  const { user } = useAuth();
  const [carrito, setCarrito] = useState(null);
  const [pedidos, setPedidos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const refreshPedidos = useCallback(async () => {
    if (!user) {
      setPedidos(null);
      return null;
    }
    setLoading(true);
    setError("");
    try {
      const data = await pedidosDelUser();
      setPedidos(data);
      return data;
    } catch (e) {
      setError(e?.error || "No se pudo cargar los pedidos");
      setPedidos(null);
      return null;
    } finally {
      setLoading(false);
    }}, [user]);


  // Refresca el carrito (cambios en user)
  const refreshCarrito = useCallback(async () => {
    if (!user) {
      setCarrito(null);
      return null;
    }
    setLoading(true);
    setError("");
    try {
      const data = await obtenerCarrito();
      setCarrito(data);
      return data;
    } catch (e) {
      setError(e?.error || "No se pudo cargar el carrito");
      setCarrito(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Rehidratar cuando cambia el usuario
  useEffect(() => {
    refreshCarrito();
    refreshPedidos();
  }, [user, refreshCarrito, refreshPedidos]);

  const addItem = async (id_carrito, id_producto) => {
    if (!user) throw new Error("Debes iniciar sesión");
    setError("");

    try {
      let carritoActivo = carrito;
      if (!carritoActivo) {
        carritoActivo = await refreshCarrito(); // o crear directamente
      }

      await agregarItemCarrito(carritoActivo.id_carrito, id_producto);
      return await refreshCarrito();
    } catch (e) {
      setError(e?.error || "No se pudo agregar el producto");
      throw e;
    }
  };


  // Disminuir item
  const removeItem = async (id_carrito, id_producto) => {
    if (!user) throw new Error("Debes iniciar sesión");
    setError("");
    try {
      await disminuirItemCarrito(id_carrito, id_producto);
      return await refreshCarrito();
    } catch (e) {
      setError(e?.error || "No se pudo disminuir el producto");
      throw e;
    }
  };

  // Eliminar item
  const deleteItem = async (id_carrito, id_producto) => {
    if (!user) throw new Error("Debes iniciar sesión");
    setError("");
    try {
      await eliminarItemDelCarrito(id_carrito, id_producto);
      return await refreshCarrito();
    } catch (e) {
      setError(e?.error || "No se pudo eliminar el producto");
      throw e;
    }
  };

  // Checkout (crear pedido)
  const checkout = async () => {
    if (!user) throw new Error("Debes iniciar sesión");
    if (!carrito) throw new Error("No hay carrito activo");
    setError("");
    try {
      await crearPedido(user.id);
      await refreshCarrito();
      await refreshPedidos();
    } catch (e) {
      setError(e?.error || "No se pudo crear el pedido");
      throw e;
    }
  };


  const value = {
    carrito,
    pedidos,
    loading,
    error,
    refreshCarrito,
    refreshPedidos,
    addItem,
    removeItem,
    deleteItem,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
