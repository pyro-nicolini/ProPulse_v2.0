import { useParams } from "react-router-dom";
import { useFadeUp } from "../../customHooks/useFadeUp";
import AddToCartButton from "../../componentes/AgregarAlCarrito";
import Resena from "../../componentes/Resena";
import { formatoCPL } from "../../utils/helpers";
import { useShop } from "../../contexts/ShopContext";
import { useCart } from "../../contexts/CartContext";
import { useState } from "react";
import { importImages } from "../../utils/helpers";

export default function Servicio() {
  const { id } = useParams();
  const { servicios } = useShop();
  const { carrito } = useCart();
  const [activeImg, setActiveImg] = useState(null);

  useFadeUp();
  const images = importImages();

  const servicio = servicios.find((s) => s.id_producto === Number(id));

  if (!servicio) return <div>Cargando...</div>;
  if (servicio.tipo !== "servicio") {
    return <div style={{ color: "red" }}>No es un servicio válido</div>;
  }

  const fallback = "servicio1_1.webp";
  const imageNames = [servicio?.url_imagen].filter(Boolean);

  const imagenes = imageNames
    .map((imageName) => {
      return images[imageName] || images[fallback];
    })
    .filter(Boolean);

  if (imagenes.length === 0) {
    imagenes.push(images[fallback]);
  }

  const mainImg = activeImg || imagenes[0] || null;

  const items = carrito?.items_carrito || [];
  const itemEnCarrito = items.find(
    (item) => item.id_producto === servicio.id_producto
  );
  const cantidadEnCarrito = Number(itemEnCarrito?.cantidad || 0);

  const stockRestante = servicio.stock
    ? servicio.stock - cantidadEnCarrito
    : 999;
  return (
    <>
      <div className="w-full flex-col items-center justify-center bg-charcoal fondo1">
        <div
          style={{ maxWidth: "25rem" }}
          className="metal card-metal fade-up visible m-1"
        >
          <h4 className="mb-1">{servicio?.titulo}</h4>

          <div className="mb-1">
            {mainImg && (
              <img
                className="img2 w-full rounded-lg border border-gray-700"
                src={mainImg}
                alt={servicio?.titulo}
                onError={(e) => {
                  // Si falla la imagen principal, usar la imagen por defecto
                  e.target.src = images[fallback];
                }}
              />
            )}

            {imagenes.length > 1 && (
              <div className="flex gap-2 mt-1 justify-center">
                {imagenes.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Vista ${i + 1}`}
                    onClick={() => setActiveImg(img)}
                    onError={(e) => {
                      // Si falla una miniatura, usar la imagen por defecto
                      e.target.src = images[fallback];
                    }}
                    className={`w-sm h-sm rounded cursor-pointer transition ${
                      activeImg === img
                        ? "border-red-500 ring-2 ring-red-400 shadow"
                        : "border-gray-300 shadow"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mb-1 flex justify-between items-center">
            <p className="text-small">Código: SRV00{servicio?.id_producto}</p>
            <h4 className="font-bold">
              {formatoCPL.format(servicio?.precio) + " CPL"}
            </h4>
          </div>
          <div className="mt-1 text-sm text-gray-400">
            <p className="mt-1 text-small2">{servicio?.descripcion}</p>
            {cantidadEnCarrito > 0 && (
              <p className="text-blue-400">
                En tu carrito: {cantidadEnCarrito}
              </p>
            )}
          </div>

          <div className="">
            <AddToCartButton
              product={servicio}
              disabled={servicio.stock && stockRestante <= 0}
            />
          </div>
        </div>
      </div>

      <div className="border-gold">
        <Resena />
      </div>
    </>
  );
}
