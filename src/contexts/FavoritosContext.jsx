import { createContext, useContext, useEffect, useState } from "react";
import { getFavoritos, addFavorito, removeFavorito } from "../api/proPulseApi";
import { useAuth } from "./AuthContext";
import { useShop } from "./ShopContext";

const FavoritosContext = createContext(null);
export const useFavoritos = () => useContext(FavoritosContext);

export default function FavoritoProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const { user } = useAuth();
  const { setProductos } = useShop();

  const fetchFavoritos = async () => {
    try {
      const data = await getFavoritos();
      if (Array.isArray(data)) setFavoritos(data);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
    }
  };

  useEffect(() => {
    if (user) fetchFavoritos();
  }, [user]);

  const agregarFavorito = async (id_producto) => {
    setBusy(true);
    try {
      await addFavorito(id_producto);
      fetchFavoritos();
    } catch (err) {
      setMsg("Error agregando favorito");
    } finally {
      setBusy(false);
    }
  };

  const eliminarFavorito = async (id_favorito) => {
    setBusy(true);
    try {
      await removeFavorito(id_favorito);
      fetchFavoritos();
    } catch (err) {
      setMsg("Error eliminando favorito");
    } finally {
      setBusy(false);
    }
  };

    const updateLikes = (id_producto, likes_count) => {
    setProductos((prev) =>
      prev.map((p) =>
        Number(p.id_producto) === Number(id_producto)
          ? { ...p, likes_count }
          : p
      )
    );
  };


  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        setFavoritos,
        agregarFavorito,
        eliminarFavorito,
        busy,
        msg,
        updateLikes,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}
