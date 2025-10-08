import { useParams } from "react-router-dom";
import { useFadeUp } from "../../customHooks/useFadeUp";
import AddToCartButton from "../../componentes/AgregarAlCarrito";
import Resena from "../../componentes/Resena";
import { formatoCPL, resolveImg } from "../../utils/helpers";
import { useShop } from "../../contexts/ShopContext";
import { useCart } from "../../contexts/CartContext";
import { useEffect, useState } from "react";
import NotFound from "../publico/NotFound";
import LightningSpinner from "../../componentes/LightningSpinner";

export default function Producto() {
  const { id } = useParams();
  const { productos } = useShop();
  const { carrito } = useCart();
  const [activeImg, setActiveImg] = useState(null);
  const [loading, setLoading] = useState(true);

  useFadeUp();

  const producto = productos.find((s) => s.id_producto === Number(id));


  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700); 
    return () => clearTimeout(timer);
  }, [id, productos]);

  if (loading) {
    return <LightningSpinner />;
  }

  if (!producto) {
    return <NotFound />;
  }

  const fallback = resolveImg("producto1_1.webp", "producto");

  const imageNames = [
    producto?.url_imagen,
    producto?.url_imagen2,
    producto?.url_imagen3,
    producto?.url_imagen4,
  ].filter(Boolean);

  const imagenes = imageNames
    .map((name) => resolveImg(name, "producto"))
    .filter((url) => url && url !== fallback);

  const mainImg = activeImg || imagenes[0] || fallback;

  const items = carrito?.items_carrito || [];
  const itemEnCarrito = items.find(
    (item) => item.id_producto === producto.id_producto
  );
  const cantidadEnCarrito = Number(itemEnCarrito?.cantidad || 0);
  const stockRestante = producto.stock - cantidadEnCarrito;

  return (
    <>
      <div className="w-full flex-col items-center justify-start bg-charcoal fondo1">
        <div
          style={{ maxWidth: "25rem" }}
          className="metal card-metal fade-up visible m-1 border-orange"
        >
          <h4 className="mb-1">⚡ {producto?.titulo}</h4>

          <div className="mb-1">
            {mainImg && (
              <img
                className="img2 w-full rounded-lg border border-gray-700"
                src={mainImg}
                alt={producto?.titulo}
                onError={(e) => {
                  e.target.src = fallback;
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
                      e.target.style.display = "none";
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
            <p className="text-small">Código: SKU000{producto?.id_producto}</p>
            <h4 className="font-bold">
              {formatoCPL.format(producto?.precio) + " CPL"}
            </h4>
          </div>

          <p>Stock: {stockRestante}</p>

          <div className="mt-1 text-sm text-gray-400">
            <p className="mt-1 text-small2">{producto?.descripcion}</p>
          </div>

          <div>
            <AddToCartButton product={producto} disabled={stockRestante <= 0} />
            {stockRestante <= 0 && (
              <p className="text-center text-sm mt-2">
                ⚠️ Sin stock disponible
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-gold">
        <Resena />
      </div>
    </>
  );
}
