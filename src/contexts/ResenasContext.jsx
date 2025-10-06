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
  const [resenas, setResenas] = useState([]); 
  const [resenasProducto, setResenasProducto] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const obtenerResenas = async () => {
    try {
      setBusy(true);
      const data = await getAllResenas();
      setResenas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error obtenerResenas:", e);
      setResenas([]);
    } finally {
      setBusy(false);
    }
  };

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

  useEffect(() => {
    obtenerResenas();
  }, []);

  return (
    <ResenasContext.Provider
      value={{
        resenas,
        resenasProducto,
        contador: resenasProducto.length,
        busy,
        msg,

        obtenerResenas,
        cargarResenasProducto,
        agregar,
        actualizar,
        eliminar,
      }}
    >
      {children}
    </ResenasContext.Provider>
  );
}
