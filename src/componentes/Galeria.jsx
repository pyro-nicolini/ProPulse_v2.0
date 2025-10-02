import { Link } from "react-router-dom";
import { useShop } from "../contexts/ShopContext";
import { useEffect, useMemo, useState } from "react";
import LikeButton from "./LikeButton";
import { formatoCPL } from "../utils/helpers";
import { useResenas } from "../contexts/ResenasContext";

/* Carga imágenes desde src/assets */
const IMGS_PRODUCTOS = import.meta.glob("../assets/img/productos/*", {
  eager: true,
  as: "url",
});
const IMGS_SERVICIOS = import.meta.glob("../assets/img/servicios/*", {
  eager: true,
  as: "url",
});

const resolveImg = (val, tipoInferido) => {
  if (val && /^https?:\/\//i.test(val)) return val; // URL absoluta
  const tipo = (tipoInferido || "").toLowerCase() === "servicio" ? "servicio" : "producto";
  const MAP = tipo === "servicio" ? IMGS_SERVICIOS : IMGS_PRODUCTOS;

  if (val) {
    const name = val.split("/").pop();
    const key =
      tipo === "servicio"
        ? `../assets/img/servicios/${name}`
        : `../assets/img/productos/${name}`;
    if (MAP[key]) return MAP[key];
  }

  const fallbackKey =
    tipo === "servicio"
      ? "../assets/img/servicios/servicio1_1.webp"
      : "../assets/img/productos/producto1_1.webp";
  return MAP[fallbackKey] || "";
};

/* ---- Tarjeta con 2 puntitos hovereables (sin autoplay) ---- */
function GaleriaCard({ item, routeBase }) {
  const tipoInferido =
    item.tipo ||
    (String(routeBase || "").toLowerCase().includes("servicio") ? "servicio" : "producto");

  // Solo 2 imágenes: principal y secundaria (si no hay 2ª, repetimos la 1ª)
  const urls = useMemo(() => {
    const cands = [item.url_imagen, item.url_imagen2].filter(Boolean);
    if (cands.length === 0) {
      cands.push(tipoInferido === "servicio" ? "servicio1_1.webp" : "producto1_1.webp");
    }
    const resolved = cands.map((c) => resolveImg(c, tipoInferido)).filter(Boolean);
    if (resolved.length === 1) resolved.push(resolved[0]);
    return resolved.slice(0, 2);
  }, [item.url_imagen, item.url_imagen2, tipoInferido]);

  const [idx, setIdx] = useState(0);
  const bgUrl = urls[idx] || "";

  // Estilos inline para asegurar visibilidad sin Tailwind
  const dotsWrapStyle = {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    gap: 8,
    zIndex: 50,              // sobre el Link
    pointerEvents: "auto",
  };
  const dotStyle = (active) => ({
    width: 10,
    height: 10,
    borderRadius: 9999,
    background: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)",
    border: "1px solid rgba(255,255,255,0.7)",
    boxShadow: active ? "0 0 6px rgba(255,255,255,0.9)" : "none",
    cursor: "pointer",
  });

  return (
    <div
      key={item.id_producto ?? item.id}
      style={{ backgroundImage: `url("${bgUrl}")` }}
      className="card-bg-img parallax relative"   // importante: relative para posicionar dots
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

      {/* 2 puntos hovereables / clickeables */}
      <div style={dotsWrapStyle}>
        {[0, 1].map((i) => (
          <span
            key={i}
            style={dotStyle(idx === i)}
            onMouseEnter={() => setIdx(i)}
            onClick={() => setIdx(i)}     // por si navegan desde móvil o sin hover
            onFocus={() => setIdx(i)}
            tabIndex={0}
            aria-label={`Ver imagen ${i + 1}`}
          />
        ))}
      </div>

      <LikeButton producto={item} />
    </div>
  );
}

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
          <GaleriaCard key={item.id_producto ?? item.id} item={item} routeBase={routeBase} />
        ))}
      </div>
    </div>
  );
}
