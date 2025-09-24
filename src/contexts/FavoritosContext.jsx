import { createContext, useContext, useState } from "react";
import {
  getUserLikeProducts,
  addLike,
  removeLike,
} from "../api/proPulseApi";
import { useAuth } from "./AuthContext";
import { useShop } from "./ShopContext";

const FavoritosContext = createContext(null);
export const useFavoritos = () => useContext(FavoritosContext);

export default function FavoritoProvider({ children }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [favoritos, setFavoritos] = useState([]);

  const { user } = useAuth();
  const { refreshProductos } = useShop();

  // Cargar todos los favoritos del usuario
  const cargarFavoritosUser = async (id_producto) => {
    if (!user) return;
    setBusy(true);
    try {
      const data = await getUserLikeProducts(id_producto); // <-- endpoint /productos/likes/:id_usuario
      console.log("Favoritos cargados:", data);
      setFavoritos(data.data || []);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
      setMsg("Error cargando favoritos");
    } finally {
      setBusy(false);
    }
  };

  const agregarFavorito = async (id_producto) => {
    if (!user) return;
    setBusy(true);
    try {
      await addLike(id_producto); // POST /productos/like
      await refreshProductos();   // refresca contador en productos
      await cargarFavoritosUser();
    } catch (err) {
      console.error("Error agregando favorito:", err);
      setMsg("Error agregando favorito");
    } finally {
      setBusy(false);
    }
  };

  const eliminarFavorito = async (id_producto) => {
    if (!user) return;
    setBusy(true);
    try {
      await removeLike(id_producto); // DELETE /productos/:id_producto/like
      await refreshProductos();
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
        cargarFavoritosUser,
        getUserLikeProducts, // 👈 lo expongo por si LikeButton quiere consultar directo
        busy,
        msg,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}
