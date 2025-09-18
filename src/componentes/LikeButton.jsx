import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFavoritos } from "../contexts/FavoritosContext";
export default function LikeButton({ producto }) {
  const { user } = useAuth();
  const { favoritos, agregarFavorito, eliminarFavorito, busy, updateLikes } = useFavoritos();
  const [msg, setMsg] = useState("");

  const idProducto = Number(producto?.id_producto ?? producto?.id);
  const losLikesDelProducto = favoritos.find((f) => Number(f.id_producto) === idProducto);
  const esFavorito = !!losLikesDelProducto;
  const favId = losLikesDelProducto?.id_favorito ?? null;

  const controladorDeLikes = async () => {
    if (!user) {
      setMsg("Inicia sesión");
      return;
    }
    if (busy) return;
    setMsg("");
    try {
      if (esFavorito && favId) {
        await eliminarFavorito(favId);
        updateLikes(idProducto, (producto.likes_count ?? 1) - 1);
      } else {
        await agregarFavorito(idProducto);
        updateLikes(idProducto, (producto.likes_count ?? 0) + 1);
      }
    } catch {
      setMsg("Error al actualizar favorito");
    }
  };

  return (
    <button
      className="like p-0 glass"
      onClick={controladorDeLikes}
      disabled={busy}
      title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={esFavorito}
      style={{ fontSize: 22, lineHeight: 1 }}
    >
      {esFavorito ? "❤️" : "🤍"}
      <span className="ml-1 text-sm text-gray-600">
        {producto?.likes_count ?? 0}
      </span>
      {msg && <span className="text-primary ml-1">{msg}</span>}
    </button>
  );
}
