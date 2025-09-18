import { useEffect, useState } from "react";
import { getProductos } from "../../api/proPulseApi";
import { useFadeUp } from "../../customHooks/useFadeUp";
import Galeria from "../../componentes/Galeria";
import Destacados from "../../componentes/Destacados";

export default function GaleriaServicios() {
  const [servicios, setServicios] = useState([]);
  useFadeUp();

  useEffect(() => {
    (async () => {
      try {
        const res = await getProductos({ tipo: "servicio" });
        const data = res.data || res;
        setServicios(data.filter((p) => p.tipo === "servicio"));
      } catch (error) {
      }
    })();
  }, []);

  const desordenarArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const serviciosBarajados = desordenarArray(servicios).slice(0, 6);
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
