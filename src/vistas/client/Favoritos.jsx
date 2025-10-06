import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useFavoritos } from "../../contexts/FavoritosContext";
import { resolveImg } from "../../utils/helpers"; // 👈 nuevo import

const Favoritos = () => {
  const { user } = useAuth();
  const { favoritos, eliminarFavorito, busy, msg } = useFavoritos();
  const nav = useNavigate();

  if (!user) return <p>Inicia sesión para ver tus Favoritos.</p>;
  if (busy && !favoritos.length) return <p>Cargando Favoritos...</p>;
  if (!favoritos.length) return <p>No tienes productos Favoritos.</p>;

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mt-3">Mis Favoritos</h2>
      {msg && <div className="text-red mb-1">{msg}</div>}

      <div className="container-card grid grid-cols-3 gap-3">
        {favoritos.map((fav) => {
          const imageUrl = resolveImg(fav?.url_imagen); // 👈 usa helper

          const goToItem = () => {
            if (fav.tipo === "producto") nav(`/productos/${fav.id_producto}`);
            else nav(`/servicios/${fav.id_producto}`);
          };

          return (
            <div
              key={fav.id_producto}
              className="metal radius text-center flex flex-col p-3"
            >
              <h4 className="font-bold text-white subtitle text-gradient-secondary">
                ❤️ {fav?.titulo}
              </h4>

              {imageUrl ? (
                <div
                  className="fav-img h-full"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                >
                  <button
                    className="btn-danger text-shadow text-small2"
                    onClick={() => eliminarFavorito(fav.id_producto)}
                    disabled={busy}
                  >
                    💔 Quitar de Favoritos
                  </button>
                  <button
                    className="btn-primary text-black mt-2 text-shadow"
                    onClick={goToItem}
                    disabled={busy}
                  >
                    Ir al Producto
                  </button>
                </div>
              ) : (
                <div className="fav-img h-full flex items-center justify-center bg-gray-800 radius">
                  <span className="text-gray-400 text-sm">Sin imagen</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favoritos;
