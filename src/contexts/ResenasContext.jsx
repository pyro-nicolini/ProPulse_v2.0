import { createContext, useContext, useState } from "react";
import {
  getAllResenas,
  getResenaProduct,
  addResena,
  updateResena,
  deleteResena,
} from "../api/proPulseApi";

const ResenasContext = createContext(null);
export const useResenas = () => useContext(ResenasContext);

export default function ResenasProvider({ children }) {
  const [resenas, setResenas] = useState([]);
  const [resenasProducto, setResenasProducto] = useState([]);

  const obtenerResenas = async () => {
    try {
      const data = await getAllResenas();
      setResenas(Array.isArray(data) ? data : []);
    } catch {
      setResenas([]);
    }
  };

  const obtenerResenasPorProducto = async (id_producto) => {
    try {
      const data = await getResenaProduct(id_producto);
      setResenasProducto(Array.isArray(data) ? data : []);
    } catch {
      setResenasProducto([]);
    }
  };

  const agregar = async (id_producto, nueva) => {
    await addResena(id_producto, nueva);
    await obtenerResenasPorProducto(id_producto);
  };

  const actualizar = async (id_resena, id_producto, cambios) => {
    await updateResena(id_resena, cambios);
    await obtenerResenasPorProducto(id_producto);
  };

  const eliminar = async (id_resena, id_producto) => {
    await deleteResena(id_resena);
    await obtenerResenasPorProducto(id_producto);
  };

  return (
    <ResenasContext.Provider
      value={{
        resenas,
        resenasProducto,
        contador: resenasProducto.length,
        obtenerResenas,
        obtenerResenasPorProducto,
        agregar,
        actualizar,
        eliminar,
      }}
    >
      {children}
    </ResenasContext.Provider>
  );
}
