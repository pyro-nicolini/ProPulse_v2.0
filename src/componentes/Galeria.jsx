import { Link } from "react-router-dom";
import { useShop } from "../contexts/ShopContext";
import { useEffect, useMemo, useState, useRef } from "react";
import LikeButton from "./LikeButton";
import { formatoCPL } from "../utils/helpers";
import { useResenas } from "../contexts/ResenasContext";

/* Carga imágenes */
const IMGS = {
  producto: import.meta.glob("../assets/img/productos/*", { eager: true, import: "default", query: "?url" }),
  servicio: import.meta.glob("../assets/img/servicios/*", { eager: true, import: "default", query: "?url" }),
};

const resolveImg = (val, tipo) => {
  if (!val) return null;
  if (/^https?:\/\//i.test(val)) return val; // URL externa
  const map = IMGS[tipo] || IMGS.producto;
  const name = val?.split("/").pop();
  return map[`../assets/img/${tipo}s/${name}`] || null;
};

function GaleriaCard({ item, routeBase }) {
  const tipo = (item.tipo || (routeBase?.includes("servicio") && "servicio")) || "producto";
  const cardRef = useRef(null);
  const animFrame = useRef(null);

  const urls = useMemo(() => {
    const imgs = [item.url_imagen, item.url_imagen2, item.url_imagen3, item.url_imagen4].filter(Boolean);
    // Solo resolvemos imágenes válidas
    return [...new Set(imgs.map((c) => resolveImg(c, tipo)).filter(Boolean))];
  }, [item, tipo]);

  const [idx, setIdx] = useState(0);

  // Variables de inercia
  let targetX = 50;
  let targetY = 50;
  let currentX = 50;
  let currentY = 50;

  const animate = () => {
    const card = cardRef.current;
    if (!card) return;

    currentX += (targetX - currentX) * .5;
    currentY += (targetY - currentY) * .5;

    // Parallax + zoom híbrido
    card.style.backgroundPosition = `${currentX}% ${currentY}%`;
    card.style.backgroundSize = "300%";   // base zoom
    card.style.transition = "transform 0.1s ease-in-out";

    animFrame.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();

    targetX = ((e.clientX - left) / width) * 100;
    targetY = ((e.clientY - top) / height) * 100;

    if (!animFrame.current) {
      animFrame.current = requestAnimationFrame(animate);
    }
  };

  const handleTouchMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const touch = e.touches[0];
    const { left, top, width, height } = card.getBoundingClientRect();

    targetX = ((touch.clientX - left) / width) * 300;
    targetY = ((touch.clientY - top) / height) * 300;

    if (!animFrame.current) {
      animFrame.current = requestAnimationFrame(animate);
    }
  };

  const resetParallax = () => {
    const card = cardRef.current;
    if (!card) return;

    cancelAnimationFrame(animFrame.current);
    animFrame.current = null;

    card.style.backgroundPosition = "center";
    card.style.backgroundSize = "cover";
  };

  return (
    <div className="p-1 card-glass parallax relative flex flex-col items-center text-shadow ">
      <h5 className="mb-1">{item.titulo.split(" ").slice(0, 3).join(" ").toUpperCase()}</h5>
      <div className="flex gap-05 items-start w-full h-min mb-1">

        {urls.length > 0 ? (
          <div
            ref={cardRef}
            className="h-min w-full card-bg-img radius object-cover mb-1 parallax shadow"
            style={{
              backgroundImage: `url(${urls[idx]})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetParallax}
            onTouchMove={handleTouchMove}
            onTouchEnd={resetParallax}
            alt={item.titulo}
            ></div>
          ) : (
            <div className="w-full bg-gray-800 flex items-center justify-center radius mb-1">
            <span className="text-gray-400 text-sm">Sin imagen</span>
          </div>
        )}
        {/* Miniaturas */}
        {urls.length > 1 && (
          <div className="flex-col gap-1 mb-1 ">
            {urls.map((u, i) => (
              <img
              key={i}
              src={u}
              onClick={() => setIdx(i)}
              className={`w-sm h-sm rounded cursor-pointer transition ${
                idx === i ? "border-red-500 ring-2 ring-red-400  shadow" : "border-gray-300  shadow"
              }`}
              alt={`miniatura-${i}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="w-full flex justify-start">
        <LikeButton producto={item} />
      </div>
        <div>
          {item.stock !== undefined && (
            <span className="text-sm text-gray-400">
              {item?.tipo === "producto" ? 
              (item.stock > 0 ? `Quedan: ${item.stock}` : "Sin stock") :
              null}
            </span>
            
          )}
          
        </div>
      <span className="flex text-center text-white">
        {(item.descripcion || "").split(" ").slice(0, 10).join(" ") + "..."}
        
      </span>
        <div className="flex gap-1">
      <h4 className="radius mb-2 text-shadow">{formatoCPL.format(item.precio)}</h4>
      <Link to={`${routeBase}/${item.id_producto ?? item.id}`}>
        <button className="btn text-white p-1 rounded mb-2">Ver Más</button>
      </Link>
        </div>
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
    <div className="p-1 fade-up visible w-full">
      <div className={`grid grid-cols-${col} gap-05`}>
        {items.map((item) => (
          <GaleriaCard key={item.id_producto ?? item.id} item={item} routeBase={routeBase} />
        ))}
      </div>
    </div>
  );
}
