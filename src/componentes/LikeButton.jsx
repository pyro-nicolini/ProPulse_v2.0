import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFavoritos } from "../contexts/FavoritosContext";

export default function LikeButton({ producto }) {
  const { user } = useAuth();
  const { agregarFavorito, eliminarFavorito, getUserLikeProducts, busy } =
    useFavoritos();

  const [msg, setMsg] = useState("");
  const [esFavorito, setEsFavorito] = useState(false);
  const [likes, setLikes] = useState(producto?.likes_count ?? 0);

  // Verificar si el usuario ya hizo like
  const usuarioHizoLike = async () => {
    if (!user || !producto) return;
    const hizoLike = await getUserLikeProducts(producto.id_producto);
    setEsFavorito(hizoLike);
  };

  useEffect(() => {
    usuarioHizoLike();
  }, [user, producto]);

  const handleLike = async () => {
    if (!user) {
      setMsg("Inicia sesión");
      setTimeout(() => setMsg(""), 2000);
      return;
    }

    try {
      if (esFavorito) {
        // Ya era favorito → quitar
        await eliminarFavorito(producto.id_producto);
        setEsFavorito(false);
        setLikes((prev) => Math.max(prev - 1, 0));
        setMsg("Quitado de favoritos");
      } else {
        // No era favorito → agregar
        await agregarFavorito(producto.id_producto);
        setEsFavorito(true);
        setLikes((prev) => prev + 1);
        setMsg("Agregado a favoritos");
      }
    } catch (err) {
      setMsg("Error al actualizar favorito");
    } finally {
      setTimeout(() => setMsg(""), 2000);
    }
  };

  return (
    <button
      className="like p-0 glass"
      onClick={handleLike}
      disabled={busy}
      title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={esFavorito}
      style={{ fontSize: 22, lineHeight: 1 }}
    >
      {esFavorito ? "❤️" : "🤍"}
      <span className="ml-1 text-sm text-gray-600">{likes}</span>
      {msg && <span className="text-primary ml-1">{msg}</span>}
    </button>
  );
}
