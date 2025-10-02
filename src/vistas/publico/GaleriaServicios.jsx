import { useFadeUp } from "../../customHooks/useFadeUp";
import Galeria from "../../componentes/Galeria";
import Destacados from "../../componentes/Destacados";
import { useShop } from "../../contexts/ShopContext";

export default function GaleriaServicios() {
  const { servicios } = useShop();
  useFadeUp();

  const desordenarArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const serviciosBarajados = desordenarArray(servicios);
  return (
    <>
      <div className="w-full">
        <div className="w-full container-1200 min-h-screen min-h-screen">
        <Galeria
          items={serviciosBarajados}
          title="Servicios"
          routeBase="/servicios"
          col={3}
          />
          </div>
        <div className="bg-charcoal w-full">
          <div className="w-full container-1200">
        <Destacados
          title="Destacados"
          col={3}
          routeBase="/servicios"
          cant={3}
          tipoProducto="servicio"
          />
          </div>
          </div>
      </div>
    </>
  );
}
