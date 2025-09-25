import { Link } from "react-router-dom";
import { useShop } from "../contexts/ShopContext";
import { useEffect } from "react";
import LikeButton from "./LikeButton";
import { formatoCPL } from "../utils/helpers";
import { useResenas } from "../contexts/ResenasContext";

export default function Galeria({ items = [], title, routeBase, col = 3 }) {
  const { refreshProductos } = useShop();
  const { Resena } = useResenas();

  useEffect(() => {
      refreshProductos();
  }, [Resena]);

  return (
    <div className="p-1 fade-up w-full">
      <h3 className="mb-6">{title}</h3>
      <div
        className={`grid ${
          col === 1
            ? "grid-cols-1"
            : col === 2
            ? "grid-cols-2"
            : col === 3
            ? "grid-cols-3"
            : col === 4
            ? "grid-cols-4"
            : ""
        } gap-3`}
      >
        {items.map((item) => (
          <div
            key={item.id_producto ?? item.id}
            style={{
              backgroundImage: item.url_imagen
                ? `url(${item.url_imagen})`
                : "none",
            }}
            className="card-bg-img parallax"
          >
            <Link to={`${routeBase}/${item.id_producto ?? item.id}`}>
              <h4>{item.titulo}</h4>
              <span className="flex text-center">{item.descripcion}</span>
              <div className="container z-10 flex-col justify-end"></div>
              <h3 className="radius">{formatoCPL.format(item.precio)}</h3>
              <div className="flex flex-col">
                <button className="btn btn-secondary text-white p-1 rounded">
                  Ver Más
                </button>
              </div>
            </Link>
            <LikeButton producto={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
