import { Link } from "react-router-dom";
import { useFadeUp } from "../customHooks/useFadeUp";
import { useShop } from "../contexts/ShopContext";
import { resolveImg } from "../utils/helpers";

const colsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3b",
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
    <div className="fade-up visible mt-2 flex-col mb-3">
      <h4 className="mb-6 radius text-shadow w-fit pl-1 ">{title}</h4>

      <div className={`grid ${colsMap[col] || colsMap[3]} gap-2 h-full`}>
        {destacados.map((item) => {
          const id = item.id_producto ?? item.id;
          const fallback =
            tipoProducto === "servicio"
              ? resolveImg("servicio1_1.webp", "servicio")
              : resolveImg("producto1_1.webp", "producto");

          const imageUrl =
            resolveImg(item?.url_imagen, tipoProducto) || fallback;

          return (
            <Link
              to={`${routeBase}/${id}`}
              className="text-center text-white w-full h-full radius"
              >
            <div
              key={id}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
              }}
              className=" shadow border-orange flex flex-col justify-between h-full"
            >
                <h5 className="m-0 bg-black text-white text-shadow font-bold w-full text-small p-05">
                {item.titulo.split(" ").slice(0, 5).join(" ")}
                </h5>
                  <div className="flex-col flex-wrap bg-gradient-secondary w-full m-0" style={{borderBottomLeftRadius: ".9rem", borderBottomRightRadius: ".9rem"}}>
                  <p className="text-shadow m-0 text-small">⭐⭐⭐⭐⭐</p>
                  <p className="m-0 text-white text-center text-shadow text-small pl-2">{item.descripcion.split(".")[0]}</p>
                  </div>
            </div>
              </Link>
          );
        })}
      </div>
    </div>
  );
}
