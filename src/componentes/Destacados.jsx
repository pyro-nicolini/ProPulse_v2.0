// src/componentes/Destacados.jsx
import { Link } from "react-router-dom";
import { useFadeUp } from "../customHooks/useFadeUp";
import { useShop } from "../contexts/ShopContext";

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
  tipoProducto = "producto",
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
          return (
            <div
              key={id}
              style={{
                backgroundImage: `url(${item.url_imagen || "/placeholder.png"})`,
              }}
              className="card-bg-img parallax"
            >
              <Link to={`${routeBase}/${id}`}>
                <h3>{item.titulo}</h3>
                <div className="container z-10 flex-col justify-end">
                  <p className="subtitle">Destacado de la semana</p>
                  <p>⭐⭐⭐⭐⭐</p>
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
