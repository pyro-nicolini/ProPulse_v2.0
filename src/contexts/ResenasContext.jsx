import { createContext, useContext, useEffect, useState } from "react";
import {
  getAllResenas,
  addResena,
  updateResena,
  deleteResena,
  getResenaProduct,
} from "../api/proPulseApi";

const ResenasContext = createContext(null);
export const useResenas = () => useContext(ResenasContext);

export default function ResenasProvider({ children }) {
  const [resenas, setResenas] = useState([]);           // todas las reseñas (admin/uso general)
  const [resenasProducto, setResenasProducto] = useState([]); // reseñas del producto actual (vista de producto)
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // Carga todas las reseñas (si tu endpoint es admin-only, úsalo donde corresponda)
  const obtenerResenas = async () => {
    try {
      setBusy(true);
      const data = await getAllResenas();   // la API ya devuelve data
      setResenas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error obtenerResenas:", e);
      setResenas([]);
    } finally {
      setBusy(false);
    }
  };

  // Carga reseñas por producto (llámalo desde la vista de producto con su id)
  const cargarResenasProducto = async (id_producto) => {
    if (!id_producto) return;
    try {
      setBusy(true);
      const data = await getResenaProduct(id_producto);
      setResenasProducto(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargarResenasProducto:", e);
      setResenasProducto([]);
    } finally {
      setBusy(false);
    }
  };

  // Agregar reseña
  const agregar = async (id_producto, { comentario, calificacion }) => {
    try {
      setBusy(true);
      await addResena(id_producto, { comentario, calificacion });
      await cargarResenasProducto(id_producto);
      setMsg("¡Gracias por tu reseña!");
    } catch (e) {
      console.error("Error agregar reseña:", e);
      setMsg("No se pudo agregar la reseña");
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(""), 2000);
    }
  };

  // Actualizar reseña por id_resena
  const actualizar = async (id_producto, { comentario, calificacion }) => {
    try {
      setBusy(true);
      await updateResena(id_producto, { comentario, calificacion });
      await cargarResenasProducto(id_producto);
      setMsg("¡Reseña actualizada!");
    } catch (e) {
      console.error("Error actualizar reseña:", e);
      setMsg("No se pudo actualizar la reseña");
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(""), 2000);
    }
  };

  // Eliminar reseña por id_resena
  const eliminar = async (id_producto) => {
    try {
      setBusy(true);
      await deleteResena(id_producto);
      await cargarResenasProducto(id_producto);
      setMsg("Reseña eliminada");
    } catch (e) {
      console.error("Error eliminar reseña:", e);
      setMsg("No se pudo eliminar la reseña");
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(""), 2000);
    }
  };

  // Si quieres cargar TODAS las reseñas al montar el provider (opcional)
  useEffect(() => {
    obtenerResenas();
  }, []);

  return (
    <ResenasContext.Provider
      value={{
        // estado
        resenas,
        resenasProducto,
        contador: resenasProducto.length,
        busy,
        msg,
        // acciones
        obtenerResenas,
        cargarResenasProducto, // <- úsalo desde la vista con el id del producto
        agregar,
        actualizar,
        eliminar,
      }}
    >
      {children}
    </ResenasContext.Provider>
  );
}
