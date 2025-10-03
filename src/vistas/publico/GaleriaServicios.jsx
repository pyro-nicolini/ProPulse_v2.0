import { useFadeUp } from "../../customHooks/useFadeUp";
import Galeria from "../../componentes/Galeria";
import Destacados from "../../componentes/Destacados";
import { useShop } from "../../contexts/ShopContext";


export default function GaleriaServicios() {
  const { servicios } = useShop();
  useFadeUp();

  const serviciosFiltrados = servicios.filter((p)=> p.tipo === "servicio")
  const desordenarArray = (array) => [...array].sort(() => Math.random() - 0.5);
  const serviciosBarajados = desordenarArray(serviciosFiltrados);

  return (
    <>
      <div className="w-full bg-products">
        <div style={{overflowY: "scroll", maxHeight: "80vh" }}>
        <div className="w-full p-6 container-1200">

        <Galeria
          items={serviciosBarajados}
          title="SERVICIOS"
          routeBase="/servicios"
          col={4}
          />
          </div>
          </div>
        <div className="bg-charcoal w-full border-gold">
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
