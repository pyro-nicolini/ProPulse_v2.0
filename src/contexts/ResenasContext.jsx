import { createContext, useContext, useEffect, useState } from "react";
import {
  getAllResenas,
  getResenaProduct,
  addResena,
  updateResena,
  deleteResena
} from "../api/proPulseApi";
import { useShop } from "./ShopContext";

const ResenasContext = createContext(null);
export const useResenas = () => useContext(ResenasContext);

export default function ResenasProvider({ children }) {
  const { refreshProductos } = useShop();
  const [resenas, setResenas] = useState([]);

  const obtenerResenas = async () => {
    try {
      const res = await getAllResenas();
      const data = res?.data ?? res;
      setResenas(data);
    } catch {
      setResenas([]);
    }
  };

  useEffect(() => {
    obtenerResenas();
  }, [refreshProductos]);

  const agregar = async (id_producto, nueva) => {
    await addResena(id_producto, nueva);
  };

  const actualizar = async (id_resena, id_producto, cambios) => {
    await updateResena(id_resena, cambios);
  };

  const eliminar = async (id_resena, id_producto) => {
    await deleteResena(id_resena);
  };

  return (
    <ResenasContext.Provider
      value={{
        resenas,
        agregar,
        actualizar,
        eliminar
      }}
    >
      {children}
    </ResenasContext.Provider>
  );
}
