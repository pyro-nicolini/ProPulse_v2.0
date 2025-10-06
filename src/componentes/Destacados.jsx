import { Link } from "react-router-dom";
import { useFadeUp } from "../customHooks/useFadeUp";
import { useShop } from "../contexts/ShopContext";
import { importImages } from "../utils/helpers";

const images = importImages();

const colsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

export default function Destacados({
  title = "Destacados",
  col = 3,
  routeBase = "/producto",
  cant = 6,
  tipoProducto = "producto", // "producto" | "servicio"
}) {
  const { productos } = useShop();
  useFadeUp();

  const destacados = (productos || [])
    .filter((p) => p?.tipo === tipoProducto && p?.destacado)
    .slice(0, cant);

  if (!destacados.length) return <div>No hay destacados para mostrar.</div>;

  return (
    <div className="p-1 fade-up visible bg-darkcharcoal">
      <h3 className="mb-6">{title}</h3>
      <div className={`grid ${colsMap[col] || colsMap[3]} gap-3`}>
        {destacados.map((item) => {
          const id = item.id_producto ?? item.id;
          const fallback = tipoProducto === "servicio" ? "servicio1_1.webp" : "producto1_1.webp";
          const imageName = item?.url_imagen || fallback;
          const imageUrl = images[imageName] || images[fallback];

          return (
            <div
              key={id}
              style={{ backgroundImage: `url(${imageUrl})` }}
              className="card-bg-img parallax"
            >
              <Link to={`${routeBase}/${id}`}>
                <h4 className=" text-center text-shadow">{item.titulo.split(" ").slice(0, 5).join(" ")}</h4>
                <div className="container z-10 flex-col justify-end">
                  <p>⭐⭐⭐⭐⭐</p>
                  <p className="subtitle text-center text-shadow">{item.descripcion}</p>
                  <button className="btn btn-primary">Ver más</button>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
