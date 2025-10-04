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
      <div className="w-full flex-col items-center justify-center bg-charcoal">
        <div style={{ maxWidth: "30rem" }} className="card fade-up visible m-1">
          <h4 className="mb-3">{producto?.titulo}</h4>

          {mainImg && (
            <img
              className="img2 w-full rounded-lg border border-gray-700"
              src={mainImg}
              alt={producto?.titulo}
            />
          )}

          {imagenes.length > 1 && (
            <div className="flex gap-2 mt-3 justify-center">
              {imagenes.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Vista ${i + 1}`}
                  onClick={() => setActiveImg(img)}
                  className={`w-sm h-sm object-cover cursor-pointer rounded-md border ${
                    img === mainImg
                      ? "border-blue-500 ring-2 ring-blue-400"
                      : "border-gray-500"
                  }`}
                />
              ))}
            </div>
          )}

          {producto?.precio && (
            <h4 className="flex justify-end mt-4 text-xl font-bold">
              {formatoCPL.format(producto?.precio)}
            </h4>
          )}

          <p className="mt-2">{producto?.descripcion}</p>

          <div className="mt-1 text-sm text-gray-400">
            <p>Stock total: {producto?.stock}</p>
            {cantidadEnCarrito > 0 && <p>En tu carrito: {cantidadEnCarrito}</p>}
            <p
              className={stockRestante <= 0 ? "text-red-400 font-semibold" : ""}
            >
              Disponible: {stockRestante}
            </p>
          </div>

          <div className="mt-4">
            <AddToCartButton product={producto} disabled={stockRestante <= 0} />
            {stockRestante <= 0 && (
              <p className="text-red-400 text-sm mt-2">
                ⚠️ Sin stock disponible
              </p>
            )}
          </div>
        </div>
      </div>

      <Resena />
    </>
  );
}
