import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useFavoritos } from "../../contexts/FavoritosContext";

// Importar imágenes (para Vite)
const importImages = () => {
  const images = {};
  const modules = import.meta.glob(
    "../../assets/img/productos/*.{png,jpg,jpeg,svg,webp}",
    { eager: true }
  );

  for (const path in modules) {
    const imageName = path.split("/").pop();
    images[imageName] = modules[path].default;
  }

  return images;
};

const images = importImages();

const Favoritos = () => {
  const { user } = useAuth();
  const { favoritos, eliminarFavorito, busy, msg } = useFavoritos();

  if (!user) return <p>Inicia sesión para ver tus Favoritos.</p>;
  if (busy && !favoritos.length) return <p>Cargando Favoritos...</p>;
  if (!favoritos.length) return <p>No tienes productos Favoritos.</p>;

  const nav = useNavigate();

  const goProduct = (id_producto) => {
    nav(`/productos/${id_producto}`);
  };

  const goServicio = (id_servicio) => {
    nav(`/servicios/${id_servicio}`);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Mis Favoritos</h2>
      <p className="subtitle text-center">Cosas que me gustan</p>
      {msg && <div className="text-red-600 mb-2">{msg}</div>}
      <div className="container-card grid grid-cols-3 gap-3">
        {favoritos.map((fav) => {
          const imageName = fav?.url_imagen || "producto1_1.webp";
          const imageUrl = images[imageName] || images["producto1_1.webp"];

          return (
            <div
              key={fav.id_producto}
              style={{ backgroundImage: `url(${imageUrl})` }}
              className="card img2 radius text-center flex flex-col p-3"
            >
              <h4 className="font-bold text-white subtitle text-gradient-secondary">
                {fav?.titulo}
              </h4>
              <div className="text-gray-300 mb-2">{fav?.descripcion}</div>
              <button
                className="btn btn-danger"
                onClick={() => eliminarFavorito(fav.id_producto)}
                disabled={busy}
              >
                💔 Quitar de Favoritos
              </button>
              <button
                className="btn btn-secondary mt-2"
                onClick={
                  fav.tipo === "producto"
                    ? () => goProduct(fav.id_producto)
                    : () => goServicio(fav.id_producto)
                }
                disabled={busy}
              >
                Ir al Producto
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Favoritos;
