import { createContext, useContext, useEffect, useState } from "react";
import { getLikesDelUser, addLike, removeLike } from "../api/proPulseApi";
import { useAuth } from "./AuthContext";
import { useShop } from "./ShopContext";

const FavoritosContext = createContext(null);
export const useFavoritos = () => useContext(FavoritosContext);

export default function FavoritoProvider({ children }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [favoritos, setFavoritos] = useState([]);

  const { user } = useAuth();

  const cargarFavoritosUser = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const data = await getLikesDelUser();
      setFavoritos(data || []);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
      setMsg("Error cargando favoritos");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      cargarFavoritosUser();
    } else {
      setFavoritos([]);
    }
  }, [user]);

  const agregarFavorito = async (id_producto) => {
    if (!user) return;
    setBusy(true);
    try {
      await addLike(id_producto);
      await cargarFavoritosUser();
    } catch (err) {
      console.error("Error agregando favorito:", err);
    } finally {
      setBusy(false);
    }
  };

  const eliminarFavorito = async (id_producto) => {
    if (!user) return;
    setBusy(true);
    try {
      await removeLike(id_producto);
      await cargarFavoritosUser();
    } catch (err) {
      console.error("Error eliminando favorito:", err);
      setMsg("Error eliminando favorito");
    } finally {
      setBusy(false);
    }
  };

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        agregarFavorito,
        eliminarFavorito,
        busy,
        msg,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}
