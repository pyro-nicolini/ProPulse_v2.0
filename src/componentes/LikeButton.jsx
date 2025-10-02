import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFavoritos } from "../contexts/FavoritosContext";

export default function LikeButton({ producto }) {
  const { user } = useAuth();
  const { agregarFavorito, eliminarFavorito, favoritos, busy } = useFavoritos();

  const [msg, setMsg] = useState("");
  const [esFavorito, setEsFavorito] = useState(false);
  const [likes, setLikes] = useState(producto?.likes_count ?? 0);

  useEffect(() => {
    if (user && producto) {
      const yaExiste = favoritos?.some(
        (f) => Number(f.id_producto) === Number(producto.id_producto)
      );
      setEsFavorito(!!yaExiste);
    } else {
      setEsFavorito(false);
    }
  }, [user, producto, favoritos]);

  const handleLike = async () => {
    if (!user) {
      setMsg("Inicia sesión");
      setTimeout(() => setMsg(""), 1000);
      return;
    }

    try {
      if (esFavorito) {
        await eliminarFavorito(producto.id_producto);
        setEsFavorito(false);
        setLikes((prev) => Math.max(prev - 1, 0));
        setMsg("Quitado de favoritos");
      } else {
        await agregarFavorito(producto.id_producto);
        setEsFavorito(true);
        setLikes((prev) => prev + 1);
        setMsg("Agregado a favoritos");
      }
    } catch (err) {
      setMsg("Error al actualizar favorito");
    } finally {
      setTimeout(() => setMsg(""), 1200);
    }
  };

  return (
    <button
      className="like p-0 glass"
      onClick={handleLike}
      disabled={busy}
      title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={esFavorito}
      style={{ fontSize: 15, lineHeight: 1 }}
    >
      {esFavorito ? "❤️" : "🤍"}
      <span className="ml-1 text-sm text-gray-600">{likes}</span>
      {msg && <strong className="text-primary ml-1">{msg}</strong>}
    </button>
  );
}
