import { createContext, useContext, useEffect, useState } from "react";
import {
  getProductos,
  getProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
  setProductoDestacado,
} from "../api/proPulseApi";

const ShopContext = createContext(null);

export const useShop = () => useContext(ShopContext);

export default function ShopProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductos = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await getProductos(filters);
      const data = res || res.data;
      if (Array.isArray(data)) {
        setProductos(data);
      }
    } catch (error) {
      setError(error);
      console.error("Error fetching productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const createProduct = async (producto) => {
    setLoading(true);
    try {
      const nuevoProducto = await crearProducto(producto);
      setProductos((prevProductos) => [...prevProductos, nuevoProducto]);
    } catch (error) {
      setError(error);
      console.error("Error creating producto:", error);
    } finally {
      setLoading(false);
    }
  };
  const updateProduct = async (id, producto) => {
    setLoading(true);
    try {
      const actualizado = await actualizarProducto(id, producto);
      setProductos((prevProductos) =>
        prevProductos.map((p) => (p.id_producto === id ? { ...p, ...actualizado } : p))
      );
    } catch (error) {
      setError(error);
      console.error("Error updating producto:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await borrarProducto(id);
      setProductos((prevProductos) =>
        prevProductos.filter((p) => p.id_producto !== id)
      );
    } catch (error) {
      setError(error);
      console.error("Error deleting producto:", error);
    } finally {
      setLoading(false);
    }
  };

  const putDestacado = async (id, destacado = true) => {
    setLoading(true);
    try {
      const updated = await setProductoDestacado(id, destacado);
      setProductos((prevProductos) =>
        prevProductos.map((p) =>
          p.id_producto === id ? { ...p, destacado: updated.destacado } : p
        )
      );
    } catch (error) {
      setError(error);
      console.error("Error setting producto destacado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        productos,
        loading,
        error,
        setProductos,
        createProduct,
        updateProduct,
        fetchProductos,
        deleteProduct,
        putDestacado,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
