import { createContext, useContext, useState } from "react";
import {
  getResenas,
  getResenasByProducto,
  crearResena,
  actualizarResena,
  borrarResena,
} from "../api/proPulseApi";

const ResenasContext = createContext(null);
export const useResenas = () => useContext(ResenasContext);

export default function ResenasProvider({ children }) {
  const [resenas, setResenas] = useState([]); 
  const [resenasProducto, setResenasProducto] = useState([]);

  const obtenerResenas = async () => {
    try {
      const data = await getResenas();
      setResenas(Array.isArray(data) ? data : []);
    } catch {
      setResenas([]);
    }
  };

  const obtenerResenasPorProducto = async (id_producto) => {
    try {
      const data = await getResenasByProducto(id_producto);
      setResenasProducto(Array.isArray(data) ? data : []);
    } catch {
      setResenasProducto([]);
    }
  };

  const agregar = async (id_producto, nueva) => {
    await crearResena(id_producto, nueva);
    await obtenerResenasPorProducto(id_producto);
  };

  const actualizar = async (id_resena, id_producto, cambios) => {
    await actualizarResena(id_resena, cambios);
    await obtenerResenasPorProducto(id_producto);
  };

  const eliminar = async (id_resena, id_producto) => {
    await borrarResena(id_resena);
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
