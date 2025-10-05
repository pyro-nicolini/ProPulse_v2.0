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
      setMsg("❤️🔒");
      setTimeout(() => setMsg(""), 1000);
      return;
    }

    try {
      if (esFavorito) {
        await eliminarFavorito(producto.id_producto);
        setEsFavorito(false);
        setLikes((prev) => Math.max(prev - 1, 0));
        setMsg("💔");
      } else {
        await agregarFavorito(producto.id_producto);
        setEsFavorito(true);
        setLikes((prev) => prev + 1);
        setMsg("+❤️");
      }
    } catch (err) {
      setMsg("Error al actualizar favorito");
    } finally {
      setTimeout(() => setMsg(""), 1500);
    }
  };

  return (
    <>
    <button
      className="like p-0 glass "
      onClick={handleLike}
      disabled={busy}
      title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={esFavorito}
      style={{ fontSize: 15, display: 'flex', alignItems: 'center', width: '60px' }}
      >
      {esFavorito ? "❤️" : "🤍"}
      <span className="text-sm text-gray-600">{likes}</span>
    </button>
      {msg && <strong style={{ fontSize: 15 }} className="text-primary strong-hover">{msg}</strong>}
      </>
  );
}
