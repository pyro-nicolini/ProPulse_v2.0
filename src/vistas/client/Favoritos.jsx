import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useFavoritos } from "../../contexts/FavoritosContext";

// Importar imágenes de productos y servicios (para Vite)
const importImages = () => {
  const images = {};
  const modulesProductos = import.meta.glob(
    "../../assets/img/productos/*.{png,jpg,jpeg,svg,webp}",
    { eager: true, import: "default" }
  );
  const modulesServicios = import.meta.glob(
    "../../assets/img/servicios/*.{png,jpg,jpeg,svg,webp}",
    { eager: true, import: "default" }
  );
  for (const path in modulesProductos) {
    const imageName = path.split("/").pop();
    images[imageName] = modulesProductos[path];
  }
  for (const path in modulesServicios) {
    const imageName = path.split("/").pop();
    images[imageName] = modulesServicios[path];
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
          const imageName = fav?.url_imagen;
          const imageUrl = imageName ? images[imageName] : null;

          return (
            <div
              key={fav.id_producto}
              className="card-metal radius text-center flex flex-col p-3"
            >
              {console.log("fav:",fav)}
              <h4 className="font-bold text-white subtitle text-gradient-secondary">
                ❤️ {fav?.titulo}
              </h4>
              {imageUrl && (
                <div
                  className="fav-img w-full h-full"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                >
              <div className="text-gray-300 mb-2">{fav?.descripcion}</div>
              <button
                className="btn-danger text-shadow text-small2"
                onClick={() => eliminarFavorito(fav.id_producto)}
                disabled={busy}
                >
                💔 Quitar de Favoritos
              </button>
              <button
                className="btn-primary text-black mt-2 text-shadow"
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Favoritos;
