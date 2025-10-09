import { useState, useEffect, useCallback } from "react";
import { useShop } from "../contexts/ShopContext";
import { resolveImg } from "../utils/helpers";
import { useFadeUp } from "../customHooks/useFadeUp";
import { Link } from "react-router-dom";

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const { productos } = useShop();
  const destacados = productos.filter((p) => p.destacado);
  
  useFadeUp();
  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % destacados.length);
  }, [destacados.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + destacados.length) % destacados.length);
  }, [destacados.length]);

  const goTo = useCallback((i) => setIndex(i), []);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [autoPlay, goNext]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const formatPrice = (precio) =>
    precio ? `$${Number(precio).toLocaleString("es-CL")}` : "";

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div
        className="carousel-container visible"
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        <div className="carousel-wrapper">
          {destacados.map((p, i) => {
            const imgUrl = resolveImg(p.url_imagen, p.tipo || "producto");

            return (
  <div
    key={p.id_producto}
    className={`carousel-slide h-full ${
      i === index ? "activa" : i < index ? "prev" : "next"
    }`}
    style={{
      backgroundImage: `url(${imgUrl})`,
      backgroundSize: "contain",
      backgroundPosition: "top",
      top: 0
    }}
  >
    <div className="flex-col justify-center items-center text-center w-full h-full">
      <div className="slide-content fade-up visible flex-col w-full justify-center items-center text-center">
        <h3 className="slide-title text-start text-shadow">{p.titulo}</h3>
        <p className="slide-description text-shadow text-white radius p-1 bg-gradient-primary shadow">{p.descripcion}</p>
        <div className="slide-price text-shadow">{formatPrice(p.precio)}</div>

        <div className="slide-buttons">
          <Link
            to={
              p.tipo === "producto"
                ? `/productos/${p.id_producto}`
                : `/servicios/${p.id_producto}`
            }
            className="btn btn-primary p-05"
          >
            Ver {p.tipo}
          </Link>
        </div>
      </div>
    </div>
    </div>
);

          })}
        </div>

        <button
          className="nav2-button nav2-prev"
          onClick={goPrev}
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          className="nav2-button nav2-next"
          onClick={goNext}
          aria-label="Siguiente"
        >
          ›
        </button>

        <div className="carousel-indicators">
          {destacados.map((_, i) => (
            <button
              key={i}
              className={`indicator ${i === index ? "activa" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="carousel-info">
        <p className="text-sm opacity-75">
          Productos destacados - {index + 1} de {destacados.length}
        </p>
      </div>
    </div>
  );
};

export default Hero;
