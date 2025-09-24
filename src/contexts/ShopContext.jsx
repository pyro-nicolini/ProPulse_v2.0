import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  borrarProducto
} from "../api/proPulseApi";

const ShopContext = createContext(null);

export const useShop = () => useContext(ShopContext);

export default function ShopProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refresca lista de productos
  const refreshProductos = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await getProductos(filters);
      const data = res?.data ?? res; // admite que API devuelva {data:[]} o []
      if (Array.isArray(data)) {
        setServicios(data.filter((item) => item.tipo === "servicio"));
        setProductos(data);
      }
    } catch (err) {
      setError(err);
      console.error("Error al refrescar productos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProductos();
  }, []);

  const createProduct = async (producto) => {
    setLoading(true);
    try {
      const nuevoProducto = await crearProducto(producto);
      // Opcional: podrías refrescar todo con refreshProductos()
      setProductos((prev) => [...prev, nuevoProducto]);
    } catch (err) {
      setError(err);
      console.error("Error creando producto:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, producto) => {
    setLoading(true);
    try {
      const actualizado = await actualizarProducto(id, producto);
      setProductos((prev) =>
        prev.map((p) =>
          p.id_producto === id ? { ...p, ...actualizado } : p
        )
      );
    } catch (err) {
      setError(err);
      console.error("Error actualizando producto:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await borrarProducto(id);
      setProductos((prev) => prev.filter((p) => p.id_producto !== id));
    } catch (err) {
      setError(err);
      console.error("Error borrando producto:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        productos,
        loading,
        servicios,
        error,
        refreshProductos,   // 👈 expuesto con el nuevo nombre
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
