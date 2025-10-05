import { useParams } from "react-router-dom";
import { useFadeUp } from "../../customHooks/useFadeUp";
import AddToCartButton from "../../componentes/AgregarAlCarrito";
import Resena from "../../componentes/Resena";
import { formatoCPL } from "../../utils/helpers";
import { useShop } from "../../contexts/ShopContext";
import { useCart } from "../../contexts/CartContext"; // 👈 importa tu contexto de carrito
import { useState, useEffect } from "react";

// Importar imágenes
const importImages = () => {
  const images = {};
  const modulesProductos = import.meta.glob(
    "../../assets/img/productos/*.{png,jpg,jpeg,svg,webp}",
    { eager: true, import: "default" }
  );
  const modulesServicios = import.meta.glob(
    "../../assets/img/servicios/*.{png,jpg,jpeg,svg,webp}",
    { eager: true, import: "default" }
  );

  for (const path in modulesProductos) {
    const imageName = path.split("/").pop();
    images[imageName] = modulesProductos[path];
  }
  for (const path in modulesServicios) {
    const imageName = path.split("/").pop();
    images[imageName] = modulesServicios[path];
  }

  return images;
};

const images = importImages();

export default function Producto() {
  const { id } = useParams();
  const { productos } = useShop();
  const { carrito } = useCart();
  const [activeImg, setActiveImg] = useState(null);

  useFadeUp();

  const producto = productos.find((s) => s.id_producto === Number(id));

  // Efecto para debug y seguimiento de cambios en el carrito
  useEffect(() => {
    if (carrito?.items_carrito) {
      console.log("Carrito actualizado:", carrito.items_carrito);
    }
  }, [carrito]);

  if (!producto) return <div>Cargando...</div>;

  // Imágenes
  const imageNames = [
    producto?.url_imagen,
    producto?.url_imagen2,
    producto?.url_imagen3,
    producto?.url_imagen4,
  ].filter(Boolean);

  const imagenes = imageNames
    .map((imageName) => images[imageName])
    .filter(Boolean);

  const mainImg = activeImg || imagenes[0] || null;

  // Contador dinámico basado en carrito real
  const items = carrito?.items_carrito || [];
  const itemEnCarrito = items.find(
    (item) => item.id_producto === producto.id_producto
  );
  const cantidadEnCarrito = Number(itemEnCarrito?.cantidad || 0);

  const stockRestante = producto.stock - cantidadEnCarrito;

  return (
    <>
      <div className="w-full flex-col items-center justify-center bg-charcoal fondo1">
        <div style={{ maxWidth: "30rem" }} className="card fade-up visible m-1">
          <h4 className="mb-1">{producto?.titulo}</h4>
          <div className="mb-1">
            {mainImg && (
              <img
                className="img2 w-full rounded-lg border border-gray-700"
                src={mainImg}
                alt={producto?.titulo}
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
                    className={`w-sm h-sm rounded cursor-pointer transition ${
                      activeImg === img
                        ? "border-red-500 ring-2 ring-red-400  shadow"
                        : "border-gray-300  shadow"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mb-1 flex justify-between items-center">
            <p className="text-small">Código: SKU00{producto?.id_producto}</p>
            <h4 className="font-bold">
              {formatoCPL.format(producto?.precio) + " CPL"}
            </h4>
          </div>
            <p>Stock: {stockRestante}</p>
          <div className="mt-1 text-sm text-gray-400">
          <p className="mt-1 text-small2">{producto?.descripcion}</p>
          </div>

          <div className="">
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
