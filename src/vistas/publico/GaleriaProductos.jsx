import { useFadeUp } from "../../customHooks/useFadeUp";
import Galeria from "../../componentes/Galeria";
import Destacados from "../../componentes/Destacados";
import { useShop } from "../../contexts/ShopContext";


export default function GaleriaProductos() {
  const { productos } = useShop();
  useFadeUp();

  const productosFiltrados = productos.filter((p)=> p.tipo === "producto")
  const desordenarArray = (array) => [...array].sort(() => Math.random() - 0.5);
  const productosBarajados = desordenarArray(productosFiltrados);

  return (
    <>
      <div className="w-full bg-products">
        <div style={{overflowY: "scroll", maxHeight: "80vh" }}>
        <div className="w-full p-6 container-1200">

        <Galeria
          items={productosBarajados}
          title="PRODUCTOS"
          routeBase="/productos"
          col={4}
          />
          </div>
          </div>
        <div className="bg-charcoal w-full border-gold">
          <div className="w-full container-1200">
        <Destacados
          title="Destacados de la semana"
          col={3}
          routeBase="/productos"
          cant={6}
          tipoProducto="producto"
          />
          </div>
          </div>
      </div>
    </>
  );
}
