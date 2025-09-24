import { useFadeUp } from "../../customHooks/useFadeUp";
import Galeria from "../../componentes/Galeria";
import Destacados from "../../componentes/Destacados";
import { useShop } from "../../contexts/ShopContext";


export default function GaleriaProductos() {
  const { productos } = useShop();
  useFadeUp();

  const productosFiltrados = productos.filter((p)=> p.tipo === "producto")
  const desordenarArray = (array) => [...array].sort(() => Math.random() - 0.5);
  const productosBarajados = desordenarArray(productosFiltrados).slice(0, 9);

  return (
    <>
      <div className="w-full">
        <div className="w-full container-1200 min-h-screen min-h-screen">

        <Galeria
          items={productosBarajados}
          title="Productos"
          routeBase="/productos"
          col={3}
          />
          </div>
        <div className="bg-charcoal w-full">
          <div className="w-full container-1200">
        <Destacados
          title="Destacados"
          col={3}
          routeBase="/productos"
          cant={3}
          tipoProducto="producto"
          />
          </div>
          </div>
      </div>
    </>
  );
}
