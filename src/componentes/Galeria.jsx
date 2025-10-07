import { Link } from "react-router-dom";
import { useShop } from "../contexts/ShopContext";
import { useEffect, useMemo, useState, useRef } from "react";
import LikeButton from "./LikeButton";
import { formatoCPL, resolveImg } from "../utils/helpers";
import { useResenas } from "../contexts/ResenasContext";

function GaleriaCard({ item, routeBase }) {
  const tipo =
    item.tipo || (routeBase?.includes("servicio") && "servicio") || "producto";
  const cardRef = useRef(null);
  const animFrame = useRef(null);

  const urls = useMemo(() => {
    const imgs = [
      item.url_imagen,
      item.url_imagen2,
      item.url_imagen3,
      item.url_imagen4,
    ].filter(Boolean);
    return [...new Set(imgs.map((c) => resolveImg(c, tipo)).filter(Boolean))];
  }, [item, tipo]);

  const [idx, setIdx] = useState(0);

  let targetX = 50;
  let targetY = 50;
  let currentX = 50;
  let currentY = 50;

  const animate = () => {
    const card = cardRef.current;
    if (!card) return;

    currentX += (targetX - currentX) * 0.5;
    currentY += (targetY - currentY) * 0.5;
    card.style.backgroundPosition = `${currentX}% ${currentY}%`;
    card.style.backgroundSize = "300%";
    card.style.transition = "transform 0.1s ease-in-out";
    animFrame.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    targetX = ((e.clientX - left) / width) * 100;
    targetY = ((e.clientY - top) / height) * 100;
    if (!animFrame.current) animFrame.current = requestAnimationFrame(animate);
  };

  const handleTouchMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const touch = e.touches[0];
    const { left, top, width, height } = card.getBoundingClientRect();
    targetX = ((touch.clientX - left) / width) * 300;
    targetY = ((touch.clientY - top) / height) * 300;
    if (!animFrame.current) animFrame.current = requestAnimationFrame(animate);
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
    <div className="metal card-metal parallax relative flex flex-col items-center justify-between text-shadow">
      <h5 className="mb-1">
        {item.titulo.split(" ").slice(0, 3).join(" ").toUpperCase()}
      </h5>

      <div className="flex gap-05 items-start w-full h-min mb-1">
        {urls.length > 0 ? (
          <div
            ref={cardRef}
            className="h-card w-full card-bg-img radius object-cover mb-1 parallax shadow"
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

        {item.tipo !== "servicio" && urls.length > 1 && (
          <div className="flex-col gap-1 mb-1">
            {urls.map((u, i) =>
              u ? (
                <img
                  key={i}
                  src={u}
                  onClick={() => setIdx(i)}
                  className={`w-sm h-sm rounded cursor-pointer transition ${
                    idx === i
                      ? "border-red-500 ring-2 ring-red-400 shadow"
                      : "border-gray-300 shadow"
                  }`}
                  alt={`miniatura-${i}`}
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : null
            )}
          </div>
        )}
      </div>

      <div className="w-full flex justify-start">
        <LikeButton producto={item} />
      </div>

      <span className="flex text-center text-white text-small2 mt-1">
        {(item.descripcion || "").split(" ").slice(0, 10).join(" ") + "..."}
      </span>

      <div className="w-full flex justify-center text-small2 items-center">
        {item.stock !== undefined && (
          <span
            className="mt-1"
            style={{
              color: item.stock > 5 ? "white" : "red",
              fontWeight: item.stock > 5 ? "normal" : "700",
            }}
          >
            {item?.tipo === "producto"
              ? item.stock > 0
                ? `Quedan: ${item.stock}`
                : "Sin stock"
              : null}
          </span>
        )}
      </div>

      <div className="flex w-full justify-evenly items-center">
        <strong className="radius text-shadow subtitle mt-1">
          {formatoCPL.format(item.precio)}
        </strong>
        <Link
          to={`${routeBase}/${item.id_producto ?? item.id}`}
          className="btn btn-primary p-05"
        >
          Ver Más
        </Link>
      </div>

      <p className="text-small text-start w-full m-0">
        Código: SKU000{item.id_producto}
      </p>
    </div>
  );
}

export default function Galeria({ items = [], title, routeBase, col = 3 }) {
  const { refreshProductos } = useShop();
  const { Resena } = useResenas();
  const [filtro, setFiltro] = useState("");
  const [ordenFijo, setOrdenFijo] = useState([]);

  useEffect(() => {
    refreshProductos();
  }, [Resena]);

  // Guardamos el orden fijo una sola vez
  useEffect(() => {
    if (items?.length) {
      setOrdenFijo(items.map((i) => i.id_producto ?? i.id));
    }
  }, [items]);

  const filtrados = useMemo(() => {
    if (!filtro.trim()) return items;
    return items.filter((i) =>
      i.titulo.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [items, filtro]);

  return (
    <div className="fade-up visible w-full min-h-screen p-1">
      <div className="fondo1 text-white pt-1 radius mb-1 w-full flex-col">
        Encuentra tú producto:
        <input
          type="text"
          placeholder="Buscar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="p-05 mb-1 radius border text-white bg-black container-800 flex items-center justify-center"
        />
      </div>

      {/* Cards con orden fijo y efecto escalonado */}
      <div className={`grid grid-cols-${col} gap-05`}>
        {ordenFijo.map((id, index) => {
          const item = filtrados.find(
            (p) => (p.id_producto ?? p.id) === id
          );
          if (!item) return null;
          return (
            <div
              key={id}
              className="card-appear"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <GaleriaCard item={item} routeBase={routeBase} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
