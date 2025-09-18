import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getMiCarrito,
  agregarItemCarrito,
  updateItemCarrito,
  borrarItemCarrito,
  crearPedido,
  calcularTotales,
  getMisPedidos,
  getPedido,
} from "../api/proPulseApi";
import { useAuth } from "./AuthContext";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export default function CartProvider({ children }) {
  const { user } = useAuth();

  const [cartId, setCartId] = useState(null);
  const [items, setItems] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      const c = await getMiCarrito();
      setCartId(c?.id_carrito ?? null);
      setItems(Array.isArray(c?.items) ? c.items : []);
    } catch (e) {
      setError(e?.error || "No se pudo cargar el carrito");
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidos = async () => {
    if (!user) return;
    try {
      const data = await getMisPedidos();
      setPedidos(Array.isArray(data) ? data : []);
    } catch {
      setPedidos([]);
    }
  };

  const fetchPedido = async (id) => {
    try {
      return await getPedido(id);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!user) {
      setCartId(null);
      setItems([]);
      setPedidos([]);
      return;
    }
    reload();
    fetchPedidos();
  }, [user?.id]);

  const addItem = async (id_producto, cantidad = 1) => {
    if (!user) throw new Error("Debes iniciar sesión");
    setError("");
    try {
      await agregarItemCarrito({ id_producto, cantidad });
      await reload();
    } catch (e) {
      setError(e?.error || "No se pudo agregar el producto");
      throw e;
    }
  };

  const updateItem = async (id_item, { cantidad }) => {
    if (!user) throw new Error("Debes iniciar sesión");
    setError("");
    try {
      await updateItemCarrito(id_item, { cantidad });
      await reload();
    } catch (e) {
      setError(e?.error || "No se pudo actualizar la cantidad");
      throw e;
    }
  };

  const removeItem = async (id_item) => {
    if (!user) throw new Error("Debes iniciar sesión");
    setError("");
    try {
      await borrarItemCarrito(id_item);
      setItems((prev) => prev.filter((x) => x.id_item !== id_item));
    } catch (e) {
      setError(e?.error || "No se pudo eliminar el ítem");
      throw e;
    }
  };

  const checkout = async () => {
    if (!user) throw new Error("Debes iniciar sesión");
    setError("");
    try {
      const pedido = await crearPedido({ id_carrito: cartId });
      await reload();
      await fetchPedidos();
      return pedido;
    } catch (e) {
      setError(e?.error || "No se pudo crear el pedido");
      throw e;
    }
  };

  const totals = useMemo(() => calcularTotales(items), [items]);
  const itemsCount = useMemo(
    () => items.reduce((acc, it) => acc + Number(it.cantidad || 0), 0),
    [items]
  );

  const value = {
    cartId,
    items,
    pedidos,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    checkout,
    reload,
    totals,
    itemsCount,
    setItems,
    fetchPedidos,
    fetchPedido,
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
